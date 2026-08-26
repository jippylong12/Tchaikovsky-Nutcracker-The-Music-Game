const numberPattern = "-?(?:\\d+(?:\\.\\d+)?|\\.\\d+)";

export function parseSwfDisplayList(dump, sourceFile) {
  const header = parseHeader(dump);
  const definitionsById = {};
  const spritesById = {};
  const root = createTimeline(null);
  const spriteStack = [];
  const timelines = new Map([[null, root]]);

  for (const block of splitTagBlocks(dump)) {
    const tag = block.tag.trimStart();
    const definitionMatch = tag.match(/^(DEFINE[A-Z0-9]+) defines id\s+0*(\d+)/);

    if (definitionMatch) {
      const [, kind, rawId] = definitionMatch;
      const id = Number(rawId);
      const boundsMatch = block.text.match(/bbox \[([^\]]+)\]/);
      const imageMatch = tag.match(/image\s+(\d+)x(\d+)\s+\((\d+) bpp\)/);
      const definition = {
        id,
        kind,
        ...(boundsMatch ? { bounds: boundsMatch[1].split(",").map((value) => Number(value.trim())) } : {}),
        ...(imageMatch
          ? { width: Number(imageMatch[1]), height: Number(imageMatch[2]), bitDepth: Number(imageMatch[3]) }
          : {}),
      };
      definitionsById[id] = definition;

      if (kind === "DEFINESPRITE") {
        const sprite = createTimeline(id);
        spritesById[id] = sprite;
        timelines.set(id, sprite);
        spriteStack.push(id);
      }
      continue;
    }

    const timeline = timelines.get(spriteStack.at(-1) ?? null) ?? root;

    if (tag.startsWith("PLACEOBJECT")) {
      timeline.placements.push(parsePlacement(block.text, timeline.spriteId, timeline.nextFrame));
      continue;
    }

    const labelMatch = tag.match(/^FRAMELABEL\s+"([^"]+)"/);
    if (labelMatch) {
      timeline.pendingLabels.push(labelMatch[1]);
      continue;
    }

    const showFrameMatch = tag.match(/^SHOWFRAME\s+(\d+)(?:-(\d+))?/);
    if (showFrameMatch) {
      const firstFrame = Number(showFrameMatch[1]);
      const finalFrame = Number(showFrameMatch[2] ?? showFrameMatch[1]);
      for (const name of timeline.pendingLabels.splice(0)) {
        timeline.frameLabels.push({ name, frame: firstFrame });
      }
      timeline.frameCount = Math.max(timeline.frameCount, finalFrame);
      timeline.nextFrame = finalFrame + 1;
      continue;
    }

    if (tag === "END" && spriteStack.length > 0) {
      spriteStack.pop();
    }
  }

  return {
    sourceFile,
    header,
    definitionsById,
    spritesById,
    root,
  };
}

export function buildDisplayListTargetProof(displayList, target) {
  const sprite = displayList.spritesById[target.symbolId];
  const allPlacements = [
    ...displayList.root.placements,
    ...Object.values(displayList.spritesById).flatMap((candidate) => candidate.placements),
  ];
  const candidatePlacements = allPlacements.filter((placement) => placement.characterId === target.symbolId);
  const hasPlacementRequirements = [
    target.preferredOwnerSpriteId,
    target.preferredFrame,
    target.preferredDepth,
    target.preferredName,
  ].some((value) => value !== undefined);
  const matchingPlacement = candidatePlacements.find(
    (placement) =>
      (target.preferredOwnerSpriteId === undefined || placement.ownerSpriteId === target.preferredOwnerSpriteId) &&
      (target.preferredFrame === undefined || placement.frame === target.preferredFrame) &&
      (target.preferredDepth === undefined || placement.depth === target.preferredDepth) &&
      (target.preferredName === undefined || placement.name === target.preferredName),
  );
  const preferredPlacement = hasPlacementRequirements ? matchingPlacement ?? null : candidatePlacements[0] ?? null;
  const framePlacements = preferredPlacement
    ? allPlacements.filter(
        (placement) =>
          placement.ownerSpriteId === preferredPlacement.ownerSpriteId && placement.frame === preferredPlacement.frame,
      )
    : [];
  const requiredFrameCharacterIds = target.requiredFrameCharacterIds ?? [];
  const compositionPlacements = framePlacements.filter((placement) =>
    requiredFrameCharacterIds.includes(placement.characterId),
  );
  const blockers = [];

  if (!sprite) {
    blockers.push(
      `${displayList.sourceFile} does not define requested sprite id ${String(target.symbolId).padStart(4, "0")}`,
    );
  } else if (candidatePlacements.length === 0) {
    blockers.push(
      `${displayList.sourceFile} defines sprite id ${String(target.symbolId).padStart(4, "0")} but no placement record references it`,
    );
  } else if (!preferredPlacement) {
    blockers.push(
      `${displayList.sourceFile} defines sprite id ${String(target.symbolId).padStart(4, "0")} but no placement matches ${formatPlacementRequirements(target)}`,
    );
  }

  if (sprite) {
    const childCharacterIds = new Set(sprite.placements.map((placement) => placement.characterId));
    const missingChildIds = (target.requiredChildCharacterIds ?? []).filter((id) => !childCharacterIds.has(id));
    if (missingChildIds.length > 0) {
      blockers.push(
        `${displayList.sourceFile} sprite id ${String(target.symbolId).padStart(4, "0")} is missing required child placement ids ${formatIds(missingChildIds)}`,
      );
    }
  }

  if (preferredPlacement) {
    const compositionCharacterIds = new Set(framePlacements.map((placement) => placement.characterId));
    const missingFrameIds = requiredFrameCharacterIds.filter((id) => !compositionCharacterIds.has(id));
    if (missingFrameIds.length > 0) {
      blockers.push(
        `${displayList.sourceFile} ${formatPlacementOwner(preferredPlacement.ownerSpriteId)} frame ${preferredPlacement.frame} is missing required composition placement ids ${formatIds(missingFrameIds)}`,
      );
    }
  }

  return {
    key: target.key,
    label: target.label,
    sourceFile: displayList.sourceFile,
    symbolId: target.symbolId,
    status: blockers.length === 0 ? "recovered" : "blocked",
    rootPlacement: preferredPlacement,
    childPlacementCount: sprite?.placements.length ?? 0,
    childPlacements: sprite?.placements ?? [],
    compositionPlacements,
    frameLabels: sprite?.frameLabels ?? [],
    promotedAssets: target.promotedAssets,
    blockers,
    notes: target.notes ?? [],
  };
}

function formatPlacementRequirements(target) {
  return [
    target.preferredOwnerSpriteId !== undefined ? `owner ${formatPlacementOwner(target.preferredOwnerSpriteId)}` : null,
    target.preferredFrame !== undefined ? `frame ${target.preferredFrame}` : null,
    target.preferredDepth !== undefined ? `depth ${String(target.preferredDepth).padStart(4, "0")}` : null,
    target.preferredName !== undefined ? `name "${target.preferredName}"` : null,
  ]
    .filter(Boolean)
    .join(", ");
}

function formatPlacementOwner(ownerSpriteId) {
  return ownerSpriteId === null ? "root" : `sprite ${String(ownerSpriteId).padStart(4, "0")}`;
}

function formatIds(ids) {
  return ids.map((id) => String(id).padStart(4, "0")).join(", ");
}

export function renderDisplayListProofHtml(targets) {
  const cards = targets
    .map(
      (target) => `
      <section class="target target-${escapeHtml(target.status)}">
        <h2>${escapeHtml(target.label)}</h2>
        <dl>
          <dt>Status</dt><dd>${escapeHtml(target.status)}</dd>
          <dt>Source</dt><dd><code>${escapeHtml(target.sourceFile)}</code></dd>
          <dt>Sprite</dt><dd>${String(target.symbolId).padStart(4, "0")}</dd>
          <dt>Placement</dt><dd>${escapeHtml(formatPlacement(target.rootPlacement))}</dd>
          <dt>Child records</dt><dd>${target.childPlacementCount}</dd>
          <dt>Frame labels</dt><dd>${escapeHtml(target.frameLabels.map((label) => `${label.name}@${label.frame}`).join(", ") || "none")}</dd>
        </dl>
        <h3>Promoted runtime assets</h3>
        <ul>${target.promotedAssets.map((asset) => `<li><code>${escapeHtml(asset)}</code></li>`).join("") || "<li>none</li>"}</ul>
        <h3>Blockers / notes</h3>
        <ul>${[...target.blockers, ...target.notes].map((note) => `<li>${escapeHtml(note)}</li>`).join("") || "<li>none</li>"}</ul>
      </section>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Nutcracker display-list proof</title>
  <style>
    body { margin: 0; padding: 24px; background: #101824; color: #eef5ff; font: 14px/1.45 system-ui, sans-serif; }
    h1 { margin: 0 0 20px; }
    main { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
    .target { border: 1px solid #5c7698; border-radius: 8px; padding: 16px; background: #182538; }
    .target-blocked { border-color: #dd8c68; }
    dl { display: grid; grid-template-columns: 110px 1fr; gap: 6px 12px; }
    dt { color: #aac4e4; } dd { margin: 0; overflow-wrap: anywhere; }
    code { color: #f3d28b; } h2, h3 { margin-bottom: 8px; }
  </style>
</head>
<body>
  <h1>Nutcracker display-list proof</h1>
  <p>Generated from <code>swfdump -b -p</code>. This is source evidence, not replacement art.</p>
  <main>${cards}
  </main>
</body>
</html>
`;
}

export function renderDisplayListCatalogModule(targets) {
  return `// Generated by scripts/extract-nutcracker-swf-assets.mjs. Do not edit by hand.\n` +
    `export const nutcrackerDisplayListTargets = ${JSON.stringify(targets, (key, value) => (key === "childPlacements" ? undefined : value), 2)} as const;\n`;
}

function createTimeline(spriteId) {
  return {
    spriteId,
    placements: [],
    frameLabels: [],
    frameCount: 0,
    nextFrame: 1,
    pendingLabels: [],
  };
}

function parseHeader(dump) {
  return {
    fileVersion: getHeaderNumber(dump, "File version"),
    frameRate: getHeaderNumber(dump, "Frame rate"),
    frameCount: getHeaderNumber(dump, "Frame count"),
    width: getHeaderNumber(dump, "Movie width"),
    height: getHeaderNumber(dump, "Movie height"),
  };
}

function getHeaderNumber(dump, label) {
  const match = dump.match(new RegExp(`\\[HEADER\\]\\s+${label}:\\s+(${numberPattern})`));
  return match ? Number(match[1]) : null;
}

function splitTagBlocks(dump) {
  const lines = dump.split(/\r?\n/);
  const blocks = [];
  let current = null;

  for (const line of lines) {
    const tagMatch = line.match(/^\[[^\]]+\]\s+\d+(.*)$/);
    if (tagMatch) {
      if (current) {
        current.text = current.lines.join("\n");
        blocks.push(current);
      }
      current = { tag: tagMatch[1], lines: [line], text: line };
    } else if (current) {
      current.lines.push(line);
    }
  }

  if (current) {
    current.text = current.lines.join("\n");
    blocks.push(current);
  }
  return blocks;
}

function parsePlacement(block, ownerSpriteId, frame) {
  const firstLine = block.split("\n", 1)[0].trimStart();
  const placementMatch = firstLine.match(
    /PLACEOBJECT\d*\s+(places id\s+0*(\d+)|moves(?: id\s+0*(\d+)| object)) at depth\s+0*(\d+)(?: name "([^"]+)")?/,
  );
  if (!placementMatch) {
    throw new Error(`Unable to parse SWF placement: ${firstLine}`);
  }

  const matrixRows = block
    .split("\n")
    .filter((line) => line.trimStart().startsWith("|") && new RegExp(`^${numberPattern}\\s+${numberPattern}\\s+${numberPattern}`).test(line.trim().slice(1).trim()))
    .slice(0, 2)
    .map((line) => line.split("|")[1].trim().split(/\s+/).slice(0, 3).map(Number));
  const matrix =
    matrixRows.length === 2
      ? [matrixRows[0][0], matrixRows[1][0], matrixRows[0][1], matrixRows[1][1], matrixRows[0][2], matrixRows[1][2]]
      : null;
  const multiply = parseColorTransformRow(block, "mul");
  const add = parseColorTransformRow(block, "add");
  const ratioMatch = block.match(
    new RegExp(
      `\\|\\s*Matrix[^\\n]*\\|\\s*Ratio[^\\n]*\\n\\s*\\|\\s*${numberPattern}\\s+${numberPattern}\\s+${numberPattern}\\s*\\|\\s*(\\d+)`,
    ),
  );

  return {
    ownerSpriteId,
    frame,
    operation: placementMatch[1].startsWith("places") ? "place" : "move",
    characterId: placementMatch[2] || placementMatch[3] ? Number(placementMatch[2] ?? placementMatch[3]) : null,
    depth: Number(placementMatch[4]),
    name: placementMatch[5] ?? null,
    matrix,
    ratio: ratioMatch ? Number(ratioMatch[1]) : null,
    colorTransform: multiply || add ? { multiply, add } : null,
  };
}

function parseColorTransformRow(block, operation) {
  const match = block.match(new RegExp(`\\|\\s*${operation}\\s+(${numberPattern})\\s+(${numberPattern})\\s+(${numberPattern})\\s+(${numberPattern})`));
  return match ? match.slice(1).map(Number) : null;
}

function formatPlacement(placement) {
  if (!placement) {
    return "not found";
  }
  const owner = placement.ownerSpriteId === null ? "root" : `sprite ${String(placement.ownerSpriteId).padStart(4, "0")}`;
  return `${owner}, depth ${String(placement.depth).padStart(4, "0")}${placement.name ? `, name ${placement.name}` : ""}, matrix ${placement.matrix?.join(" ") ?? "none"}, ratio ${placement.ratio ?? "none"}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

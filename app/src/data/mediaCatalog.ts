import type { AudioAsset, MediaManifest, SourceTextFile } from "./catalogTypes";

export function resolveBundledPath(asset: AudioAsset | SourceTextFile): string {
  return asset.publicPath;
}

export function findAudioByOriginalPath(manifest: MediaManifest, originalPath: string): AudioAsset | undefined {
  return manifest.audio.find((asset) => asset.originalPath === originalPath);
}

export function findTextByOriginalPath(manifest: MediaManifest, originalPath: string): SourceTextFile | undefined {
  return manifest.text.find((asset) => asset.originalPath === originalPath);
}

export function findCaseInsensitiveConflicts(paths: readonly string[]): readonly string[] {
  const seen = new Map<string, string>();
  const conflicts = new Set<string>();

  paths.forEach((item) => {
    const key = item.toLowerCase();
    const previous = seen.get(key);
    if (previous && previous !== item) {
      conflicts.add(previous);
      conflicts.add(item);
    } else {
      seen.set(key, item);
    }
  });

  return [...conflicts].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

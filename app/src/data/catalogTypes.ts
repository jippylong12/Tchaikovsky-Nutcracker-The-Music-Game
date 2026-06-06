export type ExtractableAssetKind =
  | "embeddedMp3"
  | "font"
  | "frame"
  | "jpeg"
  | "movieClip"
  | "png"
  | "shape"
  | "sound"
  | "soundStream";

export type NamedSwfAsset = {
  readonly id: number;
  readonly name: string;
  readonly source: "EXPORTASSETS" | "PLACEOBJECT2";
};

export type SwfExtractableAsset = {
  readonly id: number;
  readonly kind: ExtractableAssetKind;
  readonly outputPath: string;
};

export type SwfCatalogEntry = {
  readonly originalPath: string;
  readonly representative: boolean;
  readonly version: number | null;
  readonly frameRate: number | null;
  readonly frameCount: number | null;
  readonly width: number | null;
  readonly height: number | null;
  readonly actionScriptTagCount: number;
  readonly counts: {
    readonly shapes: number;
    readonly movieClips: number;
    readonly jpeg: number;
    readonly png: number;
    readonly sounds: number;
    readonly embeddedMp3: number;
    readonly fonts: number;
    readonly frames: number;
    readonly soundStreams: number;
  };
  readonly namedAssets: readonly NamedSwfAsset[];
  readonly extractableAssets: readonly SwfExtractableAsset[];
  readonly manualReconstruction: readonly string[];
};

export type AudioAsset = {
  readonly originalPath: string;
  readonly normalizedPath: string;
  readonly publicPath: string;
  readonly extension: "mp3" | "wav";
  readonly sizeBytes: number;
  readonly sha256: string;
  readonly durationSeconds: number | null;
  readonly codec: string | null;
  readonly needsConversion: boolean;
};

export type SourceTextParser =
  | "childrensAlbumDoors"
  | "childrensAlbumPatterns"
  | "flashVariables"
  | "gameKeys"
  | "melodySequences"
  | "nutcrackerDoors"
  | "nutHouseRooms"
  | "trackInfo"
  | "triviaQuestions";

export type SourceTextFile = {
  readonly originalPath: string;
  readonly normalizedPath: string;
  readonly publicPath: string;
  readonly sizeBytes: number;
  readonly sha256: string;
  readonly variableCount: number;
  readonly variableNames: readonly string[];
  readonly parser: SourceTextParser;
};

export type MediaManifest = {
  readonly sourceRoot: "analysis/setup/app";
  readonly generatedPublicRoot: "app/public/local-media";
  readonly audio: readonly AudioAsset[];
  readonly text: readonly SourceTextFile[];
};

export type VisualImportSample = {
  readonly id: string;
  readonly role: "game-screen" | "navigation-screen";
  readonly originalSwfPath: string;
  readonly assetId: number;
  readonly kind: "jpeg" | "png";
  readonly generatedPath: string;
  readonly implementationUse: string;
};

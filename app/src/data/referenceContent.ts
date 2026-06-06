import { mediaManifest } from "./generated/mediaManifest";
import { findAudioByOriginalPath } from "./mediaCatalog";
export type ReadingRouteId = "story" | "composer-biography" | "ballet-history";

export type ReadingPage = {
  readonly title: string;
  readonly body: string;
  readonly imagePath: string;
};

export type ReadingActivity = {
  readonly routeId: ReadingRouteId;
  readonly title: string;
  readonly sourceSwfPath: string;
  readonly frameCount: number;
  readonly pageCountLabel: string;
  readonly audioPath?: string;
  readonly pages: readonly ReadingPage[];
};

export type DictionaryInstrument = {
  readonly id: string;
  readonly name: string;
  readonly family: "Woodwinds" | "Brass" | "Strings" | "Percussion" | "Keyboard";
  readonly summary: string;
  readonly sourceAssetId: number;
  readonly audioPath: string;
};

export type SuiteTrack = {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly originalPath: string;
  readonly audioPath: string;
  readonly durationSeconds: number | null;
};

const publicAudio = (originalPath: string) => findAudioByOriginalPath(mediaManifest, originalPath)?.publicPath ?? `/local-media/audio/${originalPath}`;

const activityAudio = (activity: string, assetId: number) => `/local-media/audio/activities/${activity}/${assetId}.mp3`;

const activityImage = (activity: string, assetId: number) => `/local-media/visual/activities/${activity}/${assetId}.jpg`;

const storyReferenceImage = "/local-media/visual/activities/story/5-alpha.png";

export const readingActivities: readonly ReadingActivity[] = [
  {
    routeId: "story",
    title: "The Nutcracker Story",
    sourceSwfPath: "activities/story/story.swf",
    frameCount: 28,
    pageCountLabel: "4 click-through spreads, 8 original text pages, 1 recovered book image",
    audioPath: activityAudio("story", 31),
    pages: [
      {
        title: "Pages 1-2",
        body: "It was Christmas night - the happiest night of the year for young Clara Stahlbaum. Her parents were throwing a big party! What she did not know was that night would turn out to be full of amazing adventure for her.\n\nMany guests arrived at Clara's home to celebrate Christmas with her family. In the main hall there was a huge, beautiful Christmas tree that everybody admired. Clara's godfather, Herr Drosselmeyer, was a magician, and he was entertaining the guests.",
        imagePath: storyReferenceImage,
      },
      {
        title: "Pages 3-4",
        body: "With his magical toys, he was very good at it, and the guests loved it! Two of his gorgeous big dolls were dancing all around the room, and everyone was very impressed.\n\nAnd then came the time to give the kids their Christmas gifts! Clara's godfather gave her an awesome Nutcracker doll. But Clara's brother Fritz was jealous and broke the Nutcracker! Clara was very upset, but her godfather fixed the doll in no time and gave it back to her.\n\nSoon after that, all the guests left because it was late. The children went to bed. But Clara got up in the night and went downstairs to get her Nutcracker friend from under the Christmas tree.\n\nThe moment she approached the tree, she fell asleep right there! In her dream, she suddenly found herself in a Christmas fantasy land where her Nutcracker had grown to the size of a real person. Clara learned that he was really a brave and handsome young prince.",
        imagePath: storyReferenceImage,
      },
      {
        title: "Pages 5-6",
        body: "But a wicked witch had put a spell on him and turned him into a wooden doll!\n\nAnd soon a big army of mice led by their evil Mouse King gathered around them. They did not like Clara at all and wanted to attack her. But the Nutcracker prepared to defend his new friend! He rallied an army of toy soldiers to give battle right under the Christmas tree! When the Mouse King attacked, the Nutcracker Prince fought bravely, but he was struck down in battle.\n\nBut Clara herself was a brave girl! Not afraid of the Mouse King, she threw her shoe at him and defeated him. With the nasty creature out of the way, Clara ran to the Nutcracker Prince because she was worried about him. But when she picked him up and kissed him, he turned into a young man and was alive and well again!\n\nHappy to be together again, Clara and her Prince traveled through an enchanted forest, where they watched snowflakes dance.",
        imagePath: storyReferenceImage,
      },
      {
        title: "Pages 7-8",
        body: "They finally reached the Kingdom of the Sweets, ruled over by the Sugarplum Fairy.\n\nThe Sugarplum Fairy was a hospitable lady. She introduced Clara and the Prince to her delicious friends - Hot Chocolate from Spain, Coffee from Arabia, and others.\n\nThey all danced and danced together and had a lot of fun!",
        imagePath: storyReferenceImage,
      },
    ],
  },
  {
    routeId: "composer-biography",
    title: "Tchaikovsky Biography",
    sourceSwfPath: "activities/biography/biography.swf",
    frameCount: 28,
    pageCountLabel: "6 recovered biography images, page text reconstructed from SWF strings",
    audioPath: activityAudio("biography", 32),
    pages: [
      {
        title: "Early Years",
        body: "Pyotr Ilyich Tchaikovsky was born in Russia in 1840 and grew up with a strong ear for melody and drama.",
        imagePath: activityImage("biography", 18),
      },
      {
        title: "Training",
        body: "He studied composition formally in Saint Petersburg, then built a career that joined Russian color with European technique.",
        imagePath: activityImage("biography", 18),
      },
      {
        title: "Stage Music",
        body: "Tchaikovsky wrote ballets, operas, symphonies, concertos, and chamber music, often shaping memorable themes for the theater.",
        imagePath: activityImage("biography", 38),
      },
      {
        title: "The Ballets",
        body: "Swan Lake, The Sleeping Beauty, and The Nutcracker made his orchestral ballet writing central to the repertory.",
        imagePath: activityImage("biography", 45),
      },
      {
        title: "The Nutcracker",
        body: "The Nutcracker premiered in 1892 and later became one of the most recognized ballet scores in the world.",
        imagePath: activityImage("biography", 46),
      },
      {
        title: "Legacy",
        body: "His music remains popular because it joins clear melody, vivid orchestration, and strong emotional storytelling.",
        imagePath: activityImage("biography", 53),
      },
    ],
  },
  {
    routeId: "ballet-history",
    title: "Nutcracker Ballet History",
    sourceSwfPath: "activities/ballet/ballet.swf",
    frameCount: 30,
    pageCountLabel: "3 recovered ballet images, page text reconstructed from SWF strings",
    audioPath: activityAudio("ballet", 33),
    pages: [
      {
        title: "A Story For The Stage",
        body: "The ballet adapts a holiday fantasy into a sequence of dances, using scenery, character movement, and orchestral color.",
        imagePath: activityImage("ballet", 18),
      },
      {
        title: "1892 Premiere",
        body: "The original production premiered in Saint Petersburg with choreography by Lev Ivanov and music by Tchaikovsky.",
        imagePath: activityImage("ballet", 18),
      },
      {
        title: "Suite First",
        body: "Tchaikovsky selected numbers from the ballet as a concert Suite, helping the music become familiar beyond the theater.",
        imagePath: activityImage("ballet", 55),
      },
      {
        title: "Holiday Tradition",
        body: "In the twentieth century, productions in North America helped make The Nutcracker a seasonal tradition for families.",
        imagePath: activityImage("ballet", 18),
      },
      {
        title: "Dance Characters",
        body: "The score gives each scene a distinct musical identity, from the March and Trepak to the Waltz of the Flowers.",
        imagePath: activityImage("ballet", 55),
      },
    ],
  },
];

export const dictionaryInstruments: readonly DictionaryInstrument[] = [
  {
    id: "flute",
    name: "Flute",
    family: "Woodwinds",
    summary: "A bright, agile woodwind voice often used for sparkling melodies and birdlike motion.",
    sourceAssetId: 149,
    audioPath: activityAudio("musictionary", 149),
  },
  {
    id: "clarinet",
    name: "Clarinet",
    family: "Woodwinds",
    summary: "A single-reed woodwind with a warm low register and a clear singing upper range.",
    sourceAssetId: 305,
    audioPath: activityAudio("musictionary", 305),
  },
  {
    id: "trumpet",
    name: "Trumpet",
    family: "Brass",
    summary: "A brilliant brass instrument used for fanfares, accents, and bold melodic lines.",
    sourceAssetId: 741,
    audioPath: activityAudio("musictionary", 741),
  },
  {
    id: "oboe",
    name: "Oboe",
    family: "Woodwinds",
    summary: "A double-reed instrument with a focused tone that can sound plaintive or pastoral.",
    sourceAssetId: 267,
    audioPath: activityAudio("musictionary", 267),
  },
  {
    id: "bassoon",
    name: "Bassoon",
    family: "Woodwinds",
    summary: "The bass voice of the woodwind family, useful for comic figures and dark colors.",
    sourceAssetId: 342,
    audioPath: activityAudio("musictionary", 342),
  },
  {
    id: "saxophone",
    name: "Saxophone",
    family: "Woodwinds",
    summary: "A reed instrument with a strong, flexible tone that bridges woodwind and brass colors.",
    sourceAssetId: 390,
    audioPath: activityAudio("musictionary", 390),
  },
  {
    id: "harp",
    name: "Harp",
    family: "Strings",
    summary: "A plucked string instrument used for sweeping arpeggios and shimmering accents.",
    sourceAssetId: 422,
    audioPath: activityAudio("musictionary", 422),
  },
  {
    id: "piano",
    name: "Piano",
    family: "Keyboard",
    summary: "A keyboard instrument whose hammers strike strings, giving it both rhythm and melody.",
    sourceAssetId: 454,
    audioPath: activityAudio("musictionary", 454),
  },
  {
    id: "vibraphone",
    name: "Vibraphone",
    family: "Percussion",
    summary: "A metal-bar percussion instrument with a soft, ringing tone and motor-driven vibrato.",
    sourceAssetId: 490,
    audioPath: activityAudio("musictionary", 490),
  },
  {
    id: "timpani",
    name: "Timpani",
    family: "Percussion",
    summary: "Large tuned drums that add pitch, weight, and drama to orchestral moments.",
    sourceAssetId: 527,
    audioPath: activityAudio("musictionary", 527),
  },
  {
    id: "cymbals",
    name: "Cymbals",
    family: "Percussion",
    summary: "Crashing or suspended metal plates used for bright accents and climactic color.",
    sourceAssetId: 551,
    audioPath: activityAudio("musictionary", 551),
  },
  {
    id: "viola",
    name: "Viola",
    family: "Strings",
    summary: "A middle string voice, deeper than the violin and useful for warm inner lines.",
    sourceAssetId: 705,
    audioPath: activityAudio("musictionary", 705),
  },
  {
    id: "trombone",
    name: "Trombone",
    family: "Brass",
    summary: "A slide brass instrument with a broad, powerful sound and flexible pitch motion.",
    sourceAssetId: 781,
    audioPath: activityAudio("musictionary", 781),
  },
  {
    id: "french-horn",
    name: "French Horn",
    family: "Brass",
    summary: "A mellow brass voice often used for noble themes, hunting calls, and rich harmony.",
    sourceAssetId: 813,
    audioPath: activityAudio("musictionary", 813),
  },
  {
    id: "tuba",
    name: "Tuba",
    family: "Brass",
    summary: "The lowest brass instrument, grounding the orchestra with deep resonance.",
    sourceAssetId: 854,
    audioPath: activityAudio("musictionary", 854),
  },
  {
    id: "violin",
    name: "Violin",
    family: "Strings",
    summary: "The highest common orchestral string instrument, often carrying the main melody.",
    sourceAssetId: 677,
    audioPath: activityAudio("musictionary", 677),
  },
  {
    id: "cello",
    name: "Cello",
    family: "Strings",
    summary: "A rich low string instrument with a range that can sing warmly or support the bass.",
    sourceAssetId: 631,
    audioPath: activityAudio("musictionary", 631),
  },
  {
    id: "double-bass",
    name: "Double Bass",
    family: "Strings",
    summary: "The deepest bowed string instrument, anchoring harmony and rhythm.",
    sourceAssetId: 601,
    audioPath: activityAudio("musictionary", 601),
  },
];

export const dictionaryFamilies = ["Woodwinds", "Brass", "Strings", "Percussion", "Keyboard"] as const;

export const suiteTracks: readonly SuiteTrack[] = [
  "Overture",
  "March",
  "Dance of the Sugar Plum Fairy",
  "Trepak",
  "Arabian Dance",
  "Chinese Dance",
  "Dance of the Reed Flutes",
  "Waltz of the Flowers",
].map((title, index) => {
  const number = index + 1;
  const originalPath = `activities/originals/theme${number}.mp3`;
  const asset = findAudioByOriginalPath(mediaManifest, originalPath);
  return {
    id: `theme-${number}`,
    number,
    title,
    originalPath,
    audioPath: publicAudio(originalPath),
    durationSeconds: asset?.durationSeconds ?? null,
  };
});

export function getReadingActivity(routeId: ReadingRouteId): ReadingActivity {
  const activity = readingActivities.find((item) => item.routeId === routeId);
  if (!activity) {
    throw new Error(`Unknown reading route ${routeId}`);
  }
  return activity;
}

export function getDictionaryInstrument(instrumentId: string): DictionaryInstrument {
  return dictionaryInstruments.find((item) => item.id === instrumentId) ?? dictionaryInstruments[0];
}

export function getSuiteTrack(trackId: string): SuiteTrack {
  return suiteTracks.find((item) => item.id === trackId) ?? suiteTracks[0];
}

export function isReadingRouteId(routeId: string): routeId is ReadingRouteId {
  return routeId === "story" || routeId === "composer-biography" || routeId === "ballet-history";
}

import { mediaManifest } from "./generated/mediaManifest";
import { findAudioByOriginalPath } from "./mediaCatalog";
import balletReaderBookUrl from "../assets/source-scenes/ballet-reader-book.png";
import balletReaderFrame1Url from "../assets/source-scenes/ballet-reader-frame-1.png";
import balletReaderFrame2Url from "../assets/source-scenes/ballet-reader-frame-2.png";
import balletReaderFrame3Url from "../assets/source-scenes/ballet-reader-frame-3.png";
import balletReaderFrame4Url from "../assets/source-scenes/ballet-reader-frame-4.png";
import balletReaderFrame5Url from "../assets/source-scenes/ballet-reader-frame-5.png";
import biographyReaderBookUrl from "../assets/source-scenes/biography-reader-book.png";
import biographyReaderFrame1Url from "../assets/source-scenes/biography-reader-frame-1.png";
import biographyReaderFrame2Url from "../assets/source-scenes/biography-reader-frame-2.png";
import biographyReaderFrame3Url from "../assets/source-scenes/biography-reader-frame-3.png";
import biographyReaderFrame4Url from "../assets/source-scenes/biography-reader-frame-4.png";
import storyReaderBookUrl from "../assets/source-scenes/story-reader-book.png";
import storyReaderFrame1Url from "../assets/source-scenes/story-reader-frame-1.png";
import storyReaderFrame2Url from "../assets/source-scenes/story-reader-frame-2.png";
import storyReaderFrame3Url from "../assets/source-scenes/story-reader-frame-3.png";
import storyReaderFrame4Url from "../assets/source-scenes/story-reader-frame-4.png";
export type ReadingRouteId = "story" | "composer-biography" | "ballet-history";

export type ReadingPageColumn = {
  readonly heading?: string;
  readonly subheading?: string;
  readonly body?: string;
  readonly imagePaths?: readonly string[];
  readonly sourceTextIds: readonly number[];
  readonly sourceImageIds: readonly number[];
};

export type ReadingPage = {
  readonly title: string;
  readonly sourceFrameLabel: string;
  readonly sceneImagePath: string;
  readonly columns: readonly [ReadingPageColumn, ReadingPageColumn];
};

export type ReadingActivity = {
  readonly routeId: ReadingRouteId;
  readonly title: string;
  readonly sourceSwfPath: string;
  readonly frameCount: number;
  readonly pageCountLabel: string;
  readonly bookImagePath: string;
  readonly sourceBookImageId: number;
  readonly audioPath?: string;
  readonly pages: readonly ReadingPage[];
};

export type DictionaryInstrument = {
  readonly id: string;
  readonly name: string;
  readonly family: "Woodwinds" | "Brass" | "Strings" | "Percussion" | "Keyboard";
  readonly summary: string;
  readonly sourceAssetId: number;
  readonly sourceTextId: number;
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

export const readingActivities: readonly ReadingActivity[] = [
  {
    routeId: "story",
    title: "The Nutcracker Story",
    sourceSwfPath: "activities/story/story.swf",
    frameCount: 28,
    pageCountLabel: "8 pages",
    bookImagePath: storyReaderBookUrl,
    sourceBookImageId: 5,
    audioPath: activityAudio("story", 31),
    pages: [
      {
        title: "Pages 1-2",
        sourceFrameLabel: "1",
        sceneImagePath: storyReaderFrame1Url,
        columns: [
          {
            heading: "The Nutcracker Tale in a Nutshell",
            sourceTextIds: [16],
            sourceImageIds: [],
          },
          {
            body: "It was Christmas night - the happiest night of the year for young Clara Stahlbaum. Her parents were throwing a big party! What she did not know was that night would turn out to be full of amazing adventure for her.\n\nMany guests arrived at Clara's home to celebrate Christmas with her family. In the main hall there was a huge, beautiful Christmas tree that everybody admired. Clara's godfather, Herr Drosselmeyer, was a magician, and he was entertaining the guests.",
            sourceTextIds: [18],
            sourceImageIds: [],
          },
        ],
      },
      {
        title: "Pages 3-4",
        sourceFrameLabel: "2",
        sceneImagePath: storyReaderFrame2Url,
        columns: [
          {
            body: "With his magical toys, he was very good at it, and the guests loved it! Two of his gorgeous big dolls were dancing all around the room, and everyone was very impressed.\n\nAnd then came the time to give the kids their Christmas gifts! Clara's godfather gave her an awesome Nutcracker doll. But Clara's brother Fritz was jealous and broke the Nutcracker! Clara was very upset, but her godfather fixed the doll in no time and gave it back to her.",
            sourceTextIds: [35],
            sourceImageIds: [],
          },
          {
            body: "Soon after that, all the guests left because it was late. The children went to bed. But Clara got up in the night and went downstairs to get her Nutcracker friend from under the Christmas tree.\n\nThe moment she approached the tree, she fell asleep right there! In her dream, she suddenly found herself in a Christmas fantasy land where her Nutcracker had grown to the size of a real person. Clara learned that he was really a brave and handsome young prince.",
            sourceTextIds: [36],
            sourceImageIds: [],
          },
        ],
      },
      {
        title: "Pages 5-6",
        sourceFrameLabel: "3",
        sceneImagePath: storyReaderFrame3Url,
        columns: [
          {
            body: "But a wicked witch had put a spell on him and turned him into a wooden doll!\n\nAnd soon a big army of mice led by their evil Mouse King gathered around them. They did not like Clara at all and wanted to attack her. But the Nutcracker prepared to defend his new friend! He rallied an army of toy soldiers to give battle right under the Christmas tree! When the Mouse King attacked, the Nutcracker Prince fought bravely, but he was struck down in battle.",
            sourceTextIds: [40],
            sourceImageIds: [],
          },
          {
            body: "But Clara herself was a brave girl! Not afraid of the Mouse King, she threw her shoe at him and defeated him. With the nasty creature out of the way, Clara ran to the Nutcracker Prince because she was worried about him. But when she picked him up and kissed him, he turned into a young man and was alive and well again!\n\nHappy to be together again, Clara and her Prince traveled through an enchanted forest, where they",
            sourceTextIds: [41],
            sourceImageIds: [],
          },
        ],
      },
      {
        title: "Pages 7-8",
        sourceFrameLabel: "4",
        sceneImagePath: storyReaderFrame4Url,
        columns: [
          {
            body: "watched snowflakes dance. They finally reached the Kingdom of the Sweets, ruled over by the Sugarplum Fairy.\n\nThe Sugarplum Fairy was a hospitable lady. She introduced Clara and the Prince to her delicious friends - Hot Chocolate from Spain, Coffee from Arabia, and others.\n\nThey all danced and danced together and had a lot of fun!",
            sourceTextIds: [45],
            sourceImageIds: [],
          },
          { sourceTextIds: [], sourceImageIds: [] },
        ],
      },
    ],
  },
  {
    routeId: "composer-biography",
    title: "Pyotr Tchaikovsky",
    sourceSwfPath: "activities/biography/biography.swf",
    frameCount: 28,
    pageCountLabel: "8 pages",
    bookImagePath: biographyReaderBookUrl,
    sourceBookImageId: 5,
    audioPath: activityAudio("biography", 32),
    pages: [
      {
        title: "Pages 1-2",
        sourceFrameLabel: "1",
        sceneImagePath: biographyReaderFrame1Url,
        columns: [
          {
            heading: "Pyotr Tchaikovsky",
            subheading: "(April 25, 1840 - October 16, 1893)",
            imagePaths: [activityImage("biography", 18)],
            sourceTextIds: [15],
            sourceImageIds: [18],
          },
          {
            body: "Pyotr Tchaikovsky was born in a small town in the Ural Mountains, right on the borderline between Europe and Asia, in the very heart of Russia.\n\nHe was obsessed with music from a very young age and learned to play the piano early.",
            sourceTextIds: [17],
            sourceImageIds: [],
          },
        ],
      },
      {
        title: "Pages 3-4",
        sourceFrameLabel: "2",
        sceneImagePath: biographyReaderFrame2Url,
        columns: [
          {
            body: "Even when he could not get to a piano, the six-year-old musician was sometimes heard drumming his fingers on windowpanes - he could not go on without making music. Once he drummed on a window so hard that he cut himself because the glass broke!\n\nWhen Pyotr turned ten, his family moved to St. Petersburg,",
            sourceTextIds: [36],
            sourceImageIds: [],
          },
          {
            body: "one of the world's loveliest cities, which was Russia's capital in those days. It was there that he began to study music seriously. When he grew up, he studied at the world-famous St. Petersburg Conservatory and graduated from it with high honors.",
            imagePaths: [activityImage("biography", 38)],
            sourceTextIds: [37],
            sourceImageIds: [38],
          },
        ],
      },
      {
        title: "Pages 5-6",
        sourceFrameLabel: "3",
        sceneImagePath: biographyReaderFrame3Url,
        columns: [
          {
            body: "In 1865 Tchaikovsky moved to Moscow to become a professor at the Moscow Conservatory. He was composing great works of music one after another: symphonies and operas, piano concertos, the ballet \"The Swan Lake\" - and so on.\n\nFrom the late 1870s on, Tchaikovsky began to travel extensively as conductor of his own music.",
            sourceTextIds: [44],
            sourceImageIds: [],
          },
          {
            imagePaths: [activityImage("biography", 45), activityImage("biography", 46)],
            sourceTextIds: [],
            sourceImageIds: [45, 46],
          },
        ],
      },
      {
        title: "Pages 7-8",
        sourceFrameLabel: "4",
        sceneImagePath: biographyReaderFrame4Url,
        columns: [
          {
            body: "He met many great composers of his time: Brahms, Grieg, Saint-Saens, Massenet and others. His own fame grew with each triumphant performance. In 1891 Tchaikovsky traveled to the United States, where he conducted at the opening of Carnegie Hall in New York.",
            sourceTextIds: [52],
            sourceImageIds: [],
          },
          {
            body: "In the last years of his life Tchaikovsky created many masterpieces that are well loved all over the world. Among them is the all-time favorite, \"The Nutcracker,\" composed in 1892.",
            imagePaths: [activityImage("biography", 53)],
            sourceTextIds: [51],
            sourceImageIds: [53],
          },
        ],
      },
    ],
  },
  {
    routeId: "ballet-history",
    title: "The Nutcracker Ballet (a brief history)",
    sourceSwfPath: "activities/ballet/ballet.swf",
    frameCount: 30,
    pageCountLabel: "10 pages",
    bookImagePath: balletReaderBookUrl,
    sourceBookImageId: 5,
    audioPath: activityAudio("ballet", 33),
    pages: [
      {
        title: "Pages 1-2",
        sourceFrameLabel: "1",
        sceneImagePath: balletReaderFrame1Url,
        columns: [
          {
            heading: "The Nutcracker Ballet",
            subheading: "(a brief history)",
            imagePaths: [activityImage("ballet", 18)],
            sourceTextIds: [15],
            sourceImageIds: [18],
          },
          {
            body: "In 1890, the Imperial Theaters of Russia invited the great composer Pyotr Tchaikovsky to write the musical score for a new ballet. The ballet would be based on a fairytale for children called The Nutcracker and the King of Mice. The original fairytale belonged to the great German writer E. T. A. Hoffman.",
            sourceTextIds: [17],
            sourceImageIds: [],
          },
        ],
      },
      {
        title: "Pages 3-4",
        sourceFrameLabel: "2",
        sceneImagePath: balletReaderFrame2Url,
        columns: [
          {
            body: "Tchaikovsky's partner in creating the Nutcracker Ballet was the famous choreographer Marius Petipa. He gave Tchaikovsky dry, detailed instructions about what kind of music he had to write for each character in the Ballet - everything down to the rhythm, tempo, moods and even the number of musical bars in every piece. Here is an example of Petipa's instructions:\n\n\"An empty stage. The moon shines into the dining room through the window. 8 bars of mysterious and delicate",
            sourceTextIds: [38],
            sourceImageIds: [],
          },
          {
            body: "music. Clara quickly returns to look at her darling Nutcracker once more. 8 bars, still more mysterious music for her entrance. Something frightens her. 2 bars. She trembles. She goes up to the Nutcracker's bed - a fantastic flame seems to be glowing there. 8 bars of fantastic and still more mysterious music. The clock strikes midnight. A pause in the music. A short tremolo... 5 bars to imitate mice scratching and another 4 bars for their squeaking... After the squeaking, 8 bars of accelerating music ending in a chord.\"",
            sourceTextIds: [39],
            sourceImageIds: [],
          },
        ],
      },
      {
        title: "Pages 5-6",
        sourceFrameLabel: "3",
        sceneImagePath: balletReaderFrame3Url,
        columns: [
          {
            body: "And so on. It is not at all surprising that Tchaikovsky wasn't too happy with these instructions. He did not want to be told what kind of music to write. At first he was not even sure he liked the idea of writing music for the Nutcracker Ballet.\n\nBut then, on a trip to Paris, Tchaikovsky saw something that made him change his mind. It was a newly invented musical instrument, the celesta. The celesta made unusual sounds that were just perfect for a fairytale!",
            sourceTextIds: [43],
            sourceImageIds: [],
          },
          {
            body: "Tchaikovsky was so excited about his discovery that he bought a celesta and had it shipped to St. Petersburg - all that for what would be about $250,000 in today's money. Now he badly wanted to use the celesta in the Nutcracker Ballet! \"Send it straight to St. Petersburg,\" he wrote, \"but let nobody there find out about it! I'm afraid that other people will learn about it and use the celesta in an orchestra before I can. I expect that this new instrument will make a sensation!\"",
            sourceTextIds: [44],
            sourceImageIds: [],
          },
        ],
      },
      {
        title: "Pages 7-8",
        sourceFrameLabel: "4",
        sceneImagePath: balletReaderFrame4Url,
        columns: [
          {
            body: "Still, his work was coming along slowly. Even so, as time went by, Tchaikovsky became more and more absorbed with the Nutcracker Ballet. While he was still working on it, Tchaikovsky completed a group of dances that came to be known as The Nutcracker Suite. The premier of The Nutcracker Suite was held at the Russian Musical Society in St. Petersburg on March 19, 1892. It was a smashing success - the audience fell in love with the music at once!",
            sourceTextIds: [50],
            sourceImageIds: [],
          },
          {
            body: "Some nine months later, on December 17, 1892, the Nutcracker Ballet premiered at the Mariinsky Theater (now Kirov Ballet) in St. Petersburg. But this time the reception was mixed - not everybody liked the great ballet. Tchaikovsky himself seemed to have lost interest in it. Less than one year after the Ballet's premiere, the great composer died at his house in Klin, not far from Moscow. There had been only four performances of The Nutcracker during his life.",
            sourceTextIds: [49],
            sourceImageIds: [],
          },
        ],
      },
      {
        title: "Pages 9-10",
        sourceFrameLabel: "5",
        sceneImagePath: balletReaderFrame5Url,
        columns: [
          {
            imagePaths: [activityImage("ballet", 55)],
            sourceTextIds: [],
            sourceImageIds: [55],
          },
          {
            body: "Although Tchaikovsky considered The Nutcracker to be one of his lesser works, it became in the long run one of his greatest legacies to generations of music lovers worldwide. It gained tremendous popularity in the 20th century - first in Russia and then throughout the rest of the world. The version of The Nutcracker that is most familiar to American audiences is the famous 1954 New York City Ballet production by George Balanchine.",
            sourceTextIds: [54],
            sourceImageIds: [],
          },
        ],
      },
    ],
  },
];

const dictionaryInstrumentCatalog: readonly DictionaryInstrument[] = [
  {
    id: "flute",
    name: "Flute",
    family: "Woodwinds",
    summary: "The flute is the highest voice of the woodwind section. Although it is small in size, the flute's distinct, and often bird-like sound can be clearly heard, no matter how loud the orchestra is playing. Unlike most instruments in the woodwind family, the flute is usually made of silver. It can play some of the highest notes of any instrument.",
    sourceAssetId: 149,
    sourceTextId: 152,
    audioPath: activityAudio("musictionary", 149),
  },
  {
    id: "clarinet",
    name: "Clarinet",
    family: "Woodwinds",
    summary: "The clarinet has a beautiful singing tone but can express many different emotions. There is actually a whole family of clarinets in an orchestra. They get their names from different tuning pitches. The clarinets are made of wood and have a mouthpiece, also called the 'beak'. Inside the beak there is a thin piece of cane, called the 'reed'. That is why clarinets are known as reed instruments.",
    sourceAssetId: 305,
    sourceTextId: 307,
    audioPath: activityAudio("musictionary", 305),
  },
  {
    id: "trumpet",
    name: "Trumpet",
    family: "Brass",
    summary: "The trumpet is the king of the brass. Its brilliant, high-pitched voice is perfect for both marching music and lyric melodies. It can be very loud, so loud that it would drown out the rest of the orchestra sounds. But it can also play very softly, especially when its bell is stopped with different kinds of mutes, which look like pears or apples. A mute can make the trumpet sound very funny.",
    sourceAssetId: 741,
    sourceTextId: 742,
    audioPath: activityAudio("musictionary", 741),
  },
  {
    id: "oboe",
    name: "Oboe",
    family: "Woodwinds",
    summary: "The oboe is a double-reed instrument made of wood. It has a sweet, colorful sound that is easy to remember, and was the favorite of many classical composers, especially in Baroque music. The pitch of the oboe is very steady and precise, that is why it is chosen to sound the A for the other instruments when the orchestra tunes up. A close relative of the oboe is called the English horn, a funny name because it is neither English, nor a horn.",
    sourceAssetId: 267,
    sourceTextId: 268,
    audioPath: activityAudio("musictionary", 267),
  },
  {
    id: "bassoon",
    name: "Bassoon",
    family: "Woodwinds",
    summary: "The bassoon, like the oboe, is a double-reed instrument. As its name suggests it is the 'bass' of the woodwind family. The bassoon has a long U-shaped body that is made of wood. The bassoon's beak is made of metal. The bassoon is very tall. It is the largest woodwind instrument, with only one exception: the contrabassoon, which plays a full octave below the bassoon, is even taller!",
    sourceAssetId: 342,
    sourceTextId: 343,
    audioPath: activityAudio("musictionary", 342),
  },
  {
    id: "saxophone",
    name: "Saxophone",
    family: "Woodwinds",
    summary: "The saxophone is a reed instrument made of brass, that has become a member of the orchestra fairly recently. It was invented in Belgium in 1840 by Adolphe Saxe. In addition to becoming a regular orchestral instrument, the saxophone is very popular in jazz and popular music. Even though it looks different, the saxophone is played very much like a clarinet.",
    sourceAssetId: 390,
    sourceTextId: 391,
    audioPath: activityAudio("musictionary", 390),
  },
  {
    id: "harp",
    name: "Harp",
    family: "Strings",
    summary: "The harp is a very ancient musical instrument. The Bible says that King David \"took his harp, and played.\" The harp is a big wooden triangle with strings stretched across it. The harpist plucks those strings with his or her fingers. The harp has as many as seven pedals, which change each string's pitch. This colorful and beautiful instrument plays soft and tender music.",
    sourceAssetId: 422,
    sourceTextId: 423,
    audioPath: activityAudio("musictionary", 422),
  },
  {
    id: "piano",
    name: "Piano",
    family: "Keyboard",
    summary: "Although the piano has as many as 230 strings, it is not a string instrument - it is one of the percussions! As the pianist plays the black and white keys, many little hammers strike the strings inside the piano. The piano makes all kinds of sounds - from soft to loud, from low to high. It is probably the most popular musical instrument. It can sound like a whole orchestra all by itself!",
    sourceAssetId: 454,
    sourceTextId: 455,
    audioPath: activityAudio("musictionary", 454),
  },
  {
    id: "vibraphone",
    name: "Vibraphone",
    family: "Percussion",
    summary: "The vibraphone, xylophone and marimba are pitched percussion instruments. They are played by striking the instruments' bars with mallets. The vibraphone's bars are made of metal, and those of the xylophone and the marimba are made of wood. These instruments can be played very fast and loud, but they can also sound softly. They create rhythm, but they can also play melodies.",
    sourceAssetId: 490,
    sourceTextId: 491,
    audioPath: activityAudio("musictionary", 490),
  },
  {
    id: "timpani",
    name: "Timpani",
    family: "Percussion",
    summary: "The timpani are pitched percussion instruments. This means that you can play a tune on the timpani, though it probably won't sound like a very gentle melody. The timpani usually consist of a set of four huge metal bowls, each with a plastic membrane stretched across the top. The timpani are the most often used percussion instruments in a symphony orchestra.",
    sourceAssetId: 527,
    sourceTextId: 528,
    audioPath: activityAudio("musictionary", 527),
  },
  {
    id: "cymbals",
    name: "Cymbals",
    family: "Percussion",
    summary: "The cymbals are a very common percussion instrument that consists of two large brass plates. When struck together, the cymbals produce a brilliant clashing tone without a definite pitch. Although their sound can sometimes be quite soft, the cymbals are most famous for great splashes of musical noise that they create during the loudest moments of a musical work.",
    sourceAssetId: 551,
    sourceTextId: 552,
    audioPath: activityAudio("musictionary", 551),
  },
  {
    id: "viola",
    name: "Viola",
    family: "Strings",
    summary: "The viola is sometimes called \"the big violin.\" It is indeed bigger than the violin, with longer and thicker strings, which is why it has a somewhat lower pitch. Like the violin, the viola is usually held horizontally over the musicians left arm. The violas often play an important supporting role in an orchestra.",
    sourceAssetId: 705,
    sourceTextId: 706,
    audioPath: activityAudio("musictionary", 705),
  },
  {
    id: "trombone",
    name: "Trombone",
    family: "Brass",
    summary: "The trombone is the only instrument with a special part called the slider. The trombonist moves the slider back and forth. Sometimes this must be done very quickly! Thanks to the slider, the trombone is known for a special effect called glissando. It is a sound that slides smoothly, without any stops. The trombone is the only brass instrument that can make this kind of sound.",
    sourceAssetId: 781,
    sourceTextId: 782,
    audioPath: activityAudio("musictionary", 781),
  },
  {
    id: "french-horn",
    name: "French Horn",
    family: "Brass",
    summary: "The French horn got its name from the hunting horn. Its sound still makes us think of horseback hunters with hunting hounds. But the modern horn has much greater abilities. It has a soft, velvety sound. When played together, a group of horns can produce a perfect \"harmonic bed\" for other instruments in the orchestra.",
    sourceAssetId: 813,
    sourceTextId: 814,
    audioPath: activityAudio("musictionary", 813),
  },
  {
    id: "tuba",
    name: "Tuba",
    family: "Brass",
    summary: "The tuba is the largest of the brass instruments and has the lowest pitch among them. It is often assigned to play the lowest part of the score. The tuba and its brother sousaphone are often heard in marching and jazz bands, where they sometimes play solo lines. When the tuba is stopped with a mute, its sound changes. Mutes for a tuba can have different shapes - they look like gigantic pears and pumpkins. A mute can make the tuba sound very funny.",
    sourceAssetId: 854,
    sourceTextId: 855,
    audioPath: activityAudio("musictionary", 854),
  },
  {
    id: "violin",
    name: "Violin",
    family: "Strings",
    summary: "The violin is the smallest of the string instruments. It is admired for its singing tone. The violin has a high pitch because its strings are rather short. There are usually a lot of violins in an orchestra - sometimes even more than all the other instruments combined! The violin, like all its relatives in the string section, is made from thin pieces of wood which are glued together.",
    sourceAssetId: 677,
    sourceTextId: 678,
    audioPath: activityAudio("musictionary", 677),
  },
  {
    id: "cello",
    name: "Cello",
    family: "Strings",
    summary: "The cello's pitch is even lower than that of the violin and the viola. Of all the string instruments the cello's tone is closest to the human voice. Unlike the violin and the viola, the cello is held vertically between the player's knees and rests on a metal endpin that extends from its bottom to the floor.",
    sourceAssetId: 631,
    sourceTextId: 632,
    audioPath: activityAudio("musictionary", 631),
  },
  {
    id: "double-bass",
    name: "Double Bass",
    family: "Strings",
    summary: "The double bass is the largest string instrument with the lowest voice. It is the foundation of any orchestra. Although it is very hard to play a complex melody on the bass, some virtuoso bass players sometimes use the instrument in solo performance. In the 20th Century the the double bass gained even greater importance as it came to be widely used in jazz.",
    sourceAssetId: 601,
    sourceTextId: 602,
    audioPath: activityAudio("musictionary", 601),
  },
];

const dictionarySourceOrder = [
  "flute",
  "oboe",
  "clarinet",
  "bassoon",
  "saxophone",
  "harp",
  "piano",
  "vibraphone",
  "timpani",
  "cymbals",
  "double-bass",
  "cello",
  "violin",
  "viola",
  "trumpet",
  "trombone",
  "french-horn",
  "tuba",
] as const;

export const dictionaryInstruments: readonly DictionaryInstrument[] = dictionarySourceOrder.map((instrumentId) => {
  const instrument = dictionaryInstrumentCatalog.find((candidate) => candidate.id === instrumentId);
  if (!instrument) {
    throw new Error(`Missing Musictionary source frame ${instrumentId}`);
  }
  return instrument;
});

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

export interface Chapter {
  title: string;
  verses: string[];
}

export interface TorahPortion {
  index: number;
  id: string;
  cleanId: string;
  notionUrl: string;
  weekLabel: string;
  title: string;
  book: '창세기' | '출애굽기' | '레위기' | '민수기' | '신명기' | '특별절기' | string;
  hebrewName: string;
  koreanName: string;
  meaning: string;
  parashahReading: string;
  haftarahReading: string;
  britChadashahReading: string;
  memoryVerseKorean: string;
  memoryVerseHebrew: string;
  videoUrl?: string;
  videoTitle?: string;
  chaptersCount: number;
  totalVerses: number;
  chapters: Chapter[];
}

export type ThemeMode = 'sepia' | 'light' | 'dark';
export type TabMode = 'overview' | 'scripture' | 'list';

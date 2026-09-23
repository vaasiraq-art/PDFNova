export interface Bookmark {
  id: string;
  page: number;
  label: string;
  createdAt: string;
}

export interface ReadingSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  pageWidth: number;
}

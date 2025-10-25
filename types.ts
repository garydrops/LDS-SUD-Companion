export type ActiveTab = 'assistant' | 'tracker';

export interface Book {
  id: string;
  name: string;
  chapters: number;
}

export interface Volume {
  name: string;
  books: Book[];
}

export interface ScriptureData {
  [volumeId: string]: Volume;
}

export interface Progress {
  [progressKey: string]: boolean[] | string;
}

export interface UploadedFile {
  name: string;
  base64Data: string;
  mimeType: string;
}

export interface GeneratorOptions {
    theme: string;
    contextText: string;
    time: string;
    audience: string;
    generationMode: string;
    sources: string[];
    uploadedFile: UploadedFile | null;
}

export type Theme = 'light' | 'dark';
export type Language = 'pt-BR' | 'en-US' | 'es-ES';
export type FontSize = 'sm' | 'base' | 'lg';

export interface AppSettings {
    theme: Theme;
    language: Language;
    fontSize: FontSize;
}
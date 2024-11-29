export interface Category {
  name: string;
  keywords: string[];
  description: string;
}

export interface Theme {
  background: string;
  foreground: string;
  border: string;
  accent: string;
  muted: string;
}

export interface PromptState {
  photographicStyle: string;
  object: string;
  objectColor: string;
  model: string;
  scene: string;
  setting: string;
  lighting: string;
  mood: string;
  resolution: string;
}
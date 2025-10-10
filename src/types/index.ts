/**
 * Type definitions for the CV Template Maker application
 */

export type Theme = 'light' | 'dark';

export interface EditorState {
  html: string;
  css: string;
  theme: Theme;
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setTheme: (theme: Theme) => void;
  reset: () => void;
}

export interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export type EditorTab = 'html' | 'css';

export interface MonacoEditorOptions {
  minimap?: { enabled: boolean };
  fontSize?: number;
  lineNumbers?: 'on' | 'off';
  scrollBeyondLastLine?: boolean;
  automaticLayout?: boolean;
  tabSize?: number;
  wordWrap?: 'on' | 'off';
}

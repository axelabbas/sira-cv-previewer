import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TEMPLATE } from '../constants/defaultTemplate';
import { PREVIEW_DATA } from '../constants/previewData';

export type Theme = 'light' | 'dark';

const STORE_VERSION = 2; // Increment this when data structure changes

interface EditorState {
  version?: number;
  html: string;
  theme: Theme;
  previewMode: boolean;
  previewData: Record<string, unknown>;
  setHtml: (html: string) => void;
  setTheme: (theme: Theme) => void;
  setPreviewMode: (mode: boolean) => void;
  setPreviewData: (data: Record<string, unknown>) => void;
  updatePreviewValue: (path: string, value: unknown) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      version: STORE_VERSION,
      html: DEFAULT_TEMPLATE,
      theme: 'dark',
      previewMode: false,
      previewData: PREVIEW_DATA,
      setHtml: (html) => set({ html }),
      setTheme: (theme) => set({ theme }),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      setPreviewData: (data) => set({ previewData: data }),
      updatePreviewValue: (path, value) =>
        set((state) => {
          const newData = JSON.parse(JSON.stringify(state.previewData));
          const keys = path.split('.');
          let current = newData;
          
          for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) {
              current[keys[i]] = {};
            }
            current = current[keys[i]] as Record<string, unknown>;
          }
          
          current[keys[keys.length - 1]] = value;
          return { previewData: newData };
        }),
      reset: () => set({ html: DEFAULT_TEMPLATE, previewData: PREVIEW_DATA, version: STORE_VERSION }),
    }),
    {
      name: 'cv-editor-storage',
      version: STORE_VERSION,
      migrate: (persistedState: unknown) => {
        const state = persistedState as EditorState;
        
        // If version is missing or outdated, reset previewData to defaults
        if (!state.version || state.version < STORE_VERSION) {
          console.log('Migrating store from version', state.version, 'to', STORE_VERSION);
          return {
            ...state,
            version: STORE_VERSION,
            previewData: PREVIEW_DATA,
            html: state.html || DEFAULT_TEMPLATE,
          };
        }
        
        return state as EditorState;
      },
    }
  )
);

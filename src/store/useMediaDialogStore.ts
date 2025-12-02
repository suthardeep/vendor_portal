import { create } from "zustand";

// ============================================================================
// ZUSTAND STORE - Global state for media dialog
// ============================================================================

interface MediaDialogStore {
  isOpen: boolean;
  files: MediaFile[];
  currentIndex: number;
  openDialog: (files: MediaFile[], index?: number) => void;
  closeDialog: () => void;
  nextFile: () => void;
  prevFile: () => void;
  setCurrentIndex: (index: number) => void;
}

interface MediaFile {
  src: string;
  type: "image" | "pdf" | "video";
  alt?: string;
  title?: string;
}

export const useMediaDialogStore = create<MediaDialogStore>((set, _get) => ({
  isOpen: false,
  files: [],
  currentIndex: 0,
  openDialog: (files, index = 0) => set({ isOpen: true, files, currentIndex: index }),
  closeDialog: () => set({ isOpen: false, files: [], currentIndex: 0 }),
  nextFile: () => set((state) => ({ 
    currentIndex: state.currentIndex < state.files.length - 1 ? state.currentIndex + 1 : 0 
  })),
  prevFile: () => set((state) => ({ 
    currentIndex: state.currentIndex > 0 ? state.currentIndex - 1 : state.files.length - 1 
  })),
  setCurrentIndex: (index) => set({ currentIndex: index }),
}));

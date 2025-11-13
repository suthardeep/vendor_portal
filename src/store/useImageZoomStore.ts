import { create } from "zustand";

interface ImageZoomStore {
  zoomedImageSrc: string | null;
  setZoomedImageSrc: (src: string | null) => void;
}

export const useImageZoomStore = create<ImageZoomStore>((set) => ({
  zoomedImageSrc: null,
  setZoomedImageSrc: (src) => set({ zoomedImageSrc: src }),
}));
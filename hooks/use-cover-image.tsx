import { create } from "zustand";

type CoverImage = {
  url?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onReplace: (url: string) => void;
};

export const useCoverImage = create<CoverImage>((set) => ({
  isOpen: false,
  url: undefined,
  onOpen: () => set({ isOpen: true, url: undefined}),
  onClose: () => set({ isOpen: false, url: undefined }),
  onReplace: (url: string) => set({ isOpen: true, url }),
}));

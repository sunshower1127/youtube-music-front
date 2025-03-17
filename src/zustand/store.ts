import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create<{
  author: string;
  title: string;
  volume: number;
  setAuthor: (author: string) => void;
  setTitle: (title: string) => void;
  setVolume: (volume: number) => void;
}>()(
  persist(
    (set) => ({
      author: "",
      title: "",
      volume: 1,
      setAuthor: (author) => set({ author }),
      setTitle: (title) => set({ title }),
      setVolume: (volume) => set({ volume }),
    }),
    { name: "ytmdl" }
  )
);

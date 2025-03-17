import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create<{
  author: string;
  title: string;
  setAuthor: (author: string) => void;
  setTitle: (title: string) => void;
}>()(
  persist(
    (set) => ({
      author: "",
      title: "",
      setAuthor: (author) => set({ author }),
      setTitle: (title) => set({ title }),
    }),
    { name: "ytmdl" }
  )
);

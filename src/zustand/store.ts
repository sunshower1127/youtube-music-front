import { Music } from "@/types/music.ts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create<{
  nowPlaying: Music[];
  nowPlayingIndex: number;

  actions: {
    setNowPlaying: (musics: Music[]) => void;
    nextMusic: () => void;
    prevMusic: () => void;
  };
}>()(
  persist(
    (set) => ({
      nowPlaying: [],
      nowPlayingIndex: 0,
      actions: {
        setNowPlaying: (musics) => {
          set({ nowPlaying: musics, nowPlayingIndex: 0 });
        },
        nextMusic: () => set((state) => ({ nowPlayingIndex: (state.nowPlayingIndex + 1) % state.nowPlaying.length })),
        prevMusic: () =>
          set((state) => ({
            nowPlayingIndex: (state.nowPlayingIndex - 1 + state.nowPlaying.length) % state.nowPlaying.length,
          })),
      },
    }),
    {
      name: "ytmdl",
      partialize: ({ nowPlaying, nowPlayingIndex }) => ({ nowPlaying, nowPlayingIndex }),
    }
  )
);

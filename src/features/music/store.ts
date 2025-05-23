import { Music } from "@/types/music.ts";
import { shuffleArray } from "@/utils/shuffle";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMusicStore = create<{
  nowPlaying: Music[];
  nowPlayingIndex: number;

  actions: {
    setNowPlaying: (musics: Music[]) => void;
    setNowPlayingIndex: (index: number) => void;
    nextMusic: () => void;
    prevMusic: () => void;
    shuffleNowPlaying: () => void;
    addMusic: (music: Music) => void;
    removeMusics: (selection: Record<number, boolean>) => void;
    clearNowPlaying: () => void;
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
        setNowPlayingIndex: (index) => {
          set((state) => ({ nowPlayingIndex: index % state.nowPlaying.length }));
        },
        nextMusic: () => set((state) => ({ nowPlayingIndex: (state.nowPlayingIndex + 1) % state.nowPlaying.length })),
        prevMusic: () =>
          set((state) => ({
            nowPlayingIndex: (state.nowPlayingIndex - 1 + state.nowPlaying.length) % state.nowPlaying.length,
          })),
        shuffleNowPlaying: () =>
          set((state) => ({
            nowPlaying: shuffleArray(state.nowPlaying), // 소극적 셔플
            nowPlayingIndex: 0,
          })),
        addMusic: (music) => {
          set((state) => {
            const newMusics = [...state.nowPlaying, music];
            return { nowPlaying: newMusics, nowPlayingIndex: state.nowPlayingIndex };
          });
        },
        removeMusics: (selection) => {
          set((state) => {
            const newMusics = state.nowPlaying.filter((_, index) => !selection[index]);
            return {
              nowPlaying: newMusics,
              nowPlayingIndex: 0,
            };
          });
        },
        clearNowPlaying: () => {
          set({ nowPlaying: [], nowPlayingIndex: 0 });
        },
      },
    }),
    {
      name: "ytmdl",
      partialize: ({ nowPlaying, nowPlayingIndex }) => ({ nowPlaying, nowPlayingIndex }),
    }
  )
);

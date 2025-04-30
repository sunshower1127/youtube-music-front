import { Music } from "@/types/music.ts";
import { chunk, shuffle } from "es-toolkit";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create<{
  nowPlaying: Music[];
  nowPlayingIndex: number;
  errorLog: string[];

  actions: {
    setNowPlaying: (musics: Music[]) => void;
    setNowPlayingIndex: (index: number) => void;
    nextMusic: () => void;
    prevMusic: () => void;
    shuffleNowPlaying: () => void;
    addMusic: (music: Music) => void;
    removeMusics: (selection: Record<number, boolean>) => void;
    clearNowPlaying: () => void;
    addErrorLog: (error: string) => void;
    clearErrorLog: () => void;
  };
}>()(
  persist(
    (set) => ({
      nowPlaying: [],
      nowPlayingIndex: 0,
      errorLog: [],
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
            nowPlaying: chunk(chunk(chunk(state.nowPlaying, 2).flatMap(shuffle), 3).flatMap(shuffle), 5).flatMap(shuffle), // 소극적 셔플
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
            const newIndex = Math.min(state.nowPlayingIndex, newMusics.length - 1);
            return { nowPlaying: newMusics, nowPlayingIndex: newIndex };
          });
        },
        clearNowPlaying: () => {
          set({ nowPlaying: [], nowPlayingIndex: 0 });
        },
        addErrorLog: (error) => {
          set((state) => {
            const newErrorLog = [...state.errorLog, error];
            return { errorLog: newErrorLog };
          });
        },
        clearErrorLog: () => {
          set({ errorLog: [] });
        },
      },
    }),
    {
      name: "ytmdl",
      partialize: ({ nowPlaying, nowPlayingIndex, errorLog }) => ({ nowPlaying, nowPlayingIndex, errorLog }),
    }
  )
);

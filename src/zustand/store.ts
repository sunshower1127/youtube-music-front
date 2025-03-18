import { Music } from "@/components/music-table";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create<{
  playlistTitle: string;
  playlist: Music[];
  index: number;
  author: string;
  title: string;
  allMusic: Music[];
  setAllMusic: (allMusic: Music[]) => void;

  setPlaylistTitle: (playlistTitle: string) => void;
  setPlaylist: (playlist: Music[]) => void;
  setAuthor: (author: string) => void;
  setTitle: (title: string) => void;
  incrementIndex: () => void;
  decrementIndex: () => void;
}>()(
  persist(
    (set) => ({
      playlistTitle: "",
      playlist: [],
      author: "",
      title: "",
      index: 0,
      allMusic: [],
      setAllMusic: (allMusic) => set({ allMusic }),
      setPlaylistTitle: (playlistTitle) => set({ playlistTitle }),
      setPlaylist: (playlist) => {
        set({ playlist, index: 0, title: playlist[0]?.title, author: playlist[0]?.author });
      },
      setAuthor: (author) => set({ author }),
      setTitle: (title) => set({ title }),
      incrementIndex: () =>
        set((state) => {
          let newIndex = state.index + 1;
          if (state.playlist.length > 0 && newIndex >= state.playlist.length) {
            newIndex = 0;
          }
          return { index: newIndex, title: state.playlist[newIndex]?.title, author: state.playlist[newIndex]?.author };
        }),
      decrementIndex: () =>
        set((state) => {
          let newIndex = state.index - 1;
          if (state.playlist.length > 0 && newIndex < 0) {
            newIndex = state.playlist.length - 1;
          }
          return { index: newIndex, title: state.playlist[newIndex]?.title, author: state.playlist[newIndex]?.author };
        }),
    }),
    {
      name: "ytmdl",
    }
  )
);

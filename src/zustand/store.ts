import { Music } from "@/utils/music";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useStore = create<{
  playlists: Map<string, Music[]>;
  currentPlaylist: string;
  currentMusic: number;
  actions: {
    setPlaylist: (title: string, musics: Music[]) => void;
    removePlaylist: (title: string) => void;
    setCurrentPlaylist: (title: string) => void;
    setCurrentMusic: (index: number) => void;
    nextMusic: () => void;
    prevMusic: () => void;
    shuffleCurrentPlaylist: () => void;
  };
}>()(
  devtools(
    persist(
      (set, get) => ({
        playlists: new Map(),
        currentPlaylist: "",
        currentMusic: 0,
        actions: {
          setPlaylist: (title, musics) => {
            musics = musics.map((music) => ({ ...music, thumbnail: music.thumbnail || `https://ytmdl-music-server.vercel.app/api/thumbnail?author=${music.author}&title=${music.title}` }));
            set((state) => {
              const newPlaylists = new Map(state.playlists);
              newPlaylists.set(title, musics);
              return { playlists: newPlaylists };
            });
          },

          removePlaylist: (title) =>
            set((state) => {
              const newPlaylists = new Map(state.playlists);
              newPlaylists.delete(title);
              return { playlists: newPlaylists };
            }),

          setCurrentPlaylist: (title) => set({ currentPlaylist: title, currentMusic: 0 }),

          setCurrentMusic: (index) => set({ currentMusic: index }),

          nextMusic: () => {
            const state = get();
            const playlist = state.playlists.get(state.currentPlaylist);
            if (!playlist) return;

            let newIndex = state.currentMusic + 1;
            if (newIndex >= playlist.length) {
              newIndex = 0;
            }
            state.actions.setCurrentMusic(newIndex);
          },

          prevMusic: () => {
            const state = get();
            const playlist = state.playlists.get(state.currentPlaylist);
            if (!playlist) return;

            let newIndex = state.currentMusic - 1;
            if (newIndex < 0) {
              newIndex = playlist.length - 1;
            }
            state.actions.setCurrentMusic(newIndex);
          },

          shuffleCurrentPlaylist: () =>
            set((state) => {
              const playlist = state.playlists.get(state.currentPlaylist);
              if (!playlist) return {};

              const newPlaylist = [...playlist];
              for (let i = newPlaylist.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newPlaylist[i], newPlaylist[j]] = [newPlaylist[j], newPlaylist[i]];
              }

              const newPlaylists = new Map(state.playlists);
              newPlaylists.set(state.currentPlaylist, newPlaylist);
              return { playlists: newPlaylists, currentMusic: 0 };
            }),
        },
      }),
      {
        name: "ytmdl",
        partialize: ({ currentMusic, currentPlaylist }) => ({ currentMusic, currentPlaylist }), // 반드시 해줘야함
      }
    )
  )
);

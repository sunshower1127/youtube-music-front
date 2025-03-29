import firestore from "@/services/firestore";
import r2 from "@/services/r2";
import { Music } from "@/types/music";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export function useMusicLibrary() {
  const { data: musicLibrary } = useSuspenseQuery({ queryKey: ["all-music"], queryFn: () => r2.getMusicLibrary() });
  return { musicLibrary };
}

export function usePlaylist() {
  const queryClient = useQueryClient();
  const { data: playlists } = useSuspenseQuery({ queryKey: ["playlist"], queryFn: () => firestore.fetchPlaylists() });
  const { mutate: updatePlaylist } = useMutation({
    mutationFn: ({ playlistName, musics }: { playlistName: string; musics: Music[] }) => firestore.updatePlaylist(playlistName, musics),
    onMutate: async ({ playlistName, musics }) => {
      await queryClient.cancelQueries({ queryKey: ["playlist"] });
      queryClient.setQueryData(["playlist"], (oldData: Map<string, Music[]>) => {
        const newPlaylists = new Map(oldData);
        newPlaylists.set(playlistName, musics);
        return newPlaylists;
      });
    },
  });
  const { mutate: createPlaylist } = useMutation({
    mutationFn: ({ playlistName, musics }: { playlistName: string; musics: Music[] }) => firestore.createPlaylist(playlistName, musics),
    onMutate: async ({ playlistName, musics }) => {
      await queryClient.cancelQueries({ queryKey: ["playlist"] });
      queryClient.setQueryData(["playlist"], (oldData: Map<string, Music[]>) => {
        const newPlaylists = new Map(oldData);
        newPlaylists.set(playlistName, musics);
        return newPlaylists;
      });
    },
  });
  const { mutate: deletePlaylist } = useMutation({
    mutationFn: ({ playlistName }: { playlistName: string }) => firestore.deletePlaylist(playlistName),
    onMutate: async ({ playlistName }) => {
      await queryClient.cancelQueries({ queryKey: ["playlist"] });
      queryClient.setQueryData(["playlist"], (oldData: Map<string, Music[]>) => {
        const newPlaylists = new Map(oldData);
        newPlaylists.delete(playlistName);
        return newPlaylists;
      });
    },
  });

  return { playlists, updatePlaylist, createPlaylist, deletePlaylist };
}

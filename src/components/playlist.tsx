import { use, useState } from "react";
import { Music } from "./music-table";
import { PlaylistTable } from "./playlist-table";
import { Button } from "./ui/button";
import { useStore } from "@/zustand/store";

export default function Playlist({ promise }: { promise: Promise<Map<string, Music[]>> }) {
  const playlists = use(promise);
  const [playlist, setPlaylist] = useState("");
  const setCurrentPlaylist = useStore((state) => state.setPlaylist);
  const setCurrentPlaylistTitle = useStore((state) => state.setPlaylistTitle);

  return (
    <>
      <ul>
        {Array.from(playlists.keys()).map((playlist) => (
          <li key={playlist}>
            <Button className="w-full" variant="outline" onClick={() => setPlaylist(playlist)}>
              {playlist}
            </Button>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          setCurrentPlaylistTitle(playlist);
          setCurrentPlaylist(playlists.get(playlist) || []);
        }}
      >
        Play
      </Button>
      <PlaylistTable data={playlists.get(playlist) || []} />
    </>
  );
}

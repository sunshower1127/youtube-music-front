import { useStore } from "@/zustand/store";
import { useState } from "react";
import { PlaylistTable } from "./playlist-table";
import { Button } from "./ui/button";

export default function Playlist() {
  const playlists = useStore((state) => state.playlists);
  const currentPlaylist = useStore((state) => state.currentPlaylist);
  const { setCurrentPlaylist } = useStore((state) => state.actions);
  const [selectedPlaylist, setSelectedPlaylist] = useState(currentPlaylist || "All");

  return (
    <div className="flex flex-col items-center gap-5 border">
      <ul>
        {Array.from(playlists.keys()).map((playlist) => (
          <li key={playlist}>
            <Button className="w-full" variant="outline" onClick={() => setSelectedPlaylist(playlist)}>
              {playlist === selectedPlaylist ? "👉" + playlist : playlist}
            </Button>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          setCurrentPlaylist(selectedPlaylist);
        }}
      >
        Play
      </Button>
      <PlaylistTable selectedPlaylist={selectedPlaylist} />
    </div>
  );
}

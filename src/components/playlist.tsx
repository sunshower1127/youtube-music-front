import { removePlaylist as removeFirebasePlaylist } from "@/firebase/firebase";
import { useStore } from "@/zustand/store";
import { useState } from "react";
import { PlaylistTable } from "./playlist-table";
import { Button } from "./ui/button";

export default function Playlist() {
  const playlists = useStore((state) => state.playlists);
  const currentPlaylist = useStore((state) => state.currentPlaylist);
  const { setCurrentPlaylist, removePlaylist } = useStore((state) => state.actions);
  const [selectedPlaylist, setSelectedPlaylist] = useState(currentPlaylist || "All");

  const deletePlaylist = async () => {
    if (selectedPlaylist === "All") return;
    setCurrentPlaylist("All");
    removePlaylist(selectedPlaylist);
    await removeFirebasePlaylist(selectedPlaylist);
  };

  return (
    <div className="flex flex-col items-center gap-2 border">
      <p>Playlists</p>
      <ul className="w-full p-2">
        {Array.from(playlists.keys()).map((playlist) => (
          <li className="border p-1" key={playlist}>
            <div className="w-full text-sm" onClick={() => setSelectedPlaylist(playlist)}>
              {playlist === selectedPlaylist ? "👉" + playlist : playlist}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between w-full p-2">
        <Button
          onClick={() => {
            setCurrentPlaylist(selectedPlaylist);
          }}
        >
          Play
        </Button>
        <Button variant="destructive" onClick={deletePlaylist}>
          Delete Playlist
        </Button>
      </div>
      <PlaylistTable selectedPlaylist={selectedPlaylist} />
    </div>
  );
}

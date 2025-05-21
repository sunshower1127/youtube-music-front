import { MusicTable } from "@/components/music-table";
import { Button } from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMusicStore } from "@/features/music/store";
import { usePlaylist } from "@/hooks/react-query.ts";
import { useState } from "react";

export default function Playlist() {
  const { playlists, deletePlaylist } = usePlaylist();
  const [playlistName, setPlaylistName] = useState("");
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  const { setNowPlaying } = useMusicStore((state) => state.actions);

  const handleListen = () => {
    setNowPlaying(playlists.get(playlistName) || []);
  };

  const handleDelete = () => {
    deletePlaylist({ playlistName });
    setPlaylistName("");
    setSelection({});
  };

  return (
    <section className="w-dvw flex flex-col gap-5">
      <Select value={playlistName} onValueChange={setPlaylistName}>
        <SelectTrigger>
          <SelectValue placeholder="Select a playlist" />
        </SelectTrigger>
        <SelectContent>
          {[...playlists.keys()].map((title) => (
            <SelectItem key={title} value={title}>
              {title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <MusicTable musics={playlists.get(playlistName) || []} selection={selection} onSelectionChange={setSelection} />
      <div className="flex flex-row gap-2">
        <Button onClick={handleListen}>Replace Now Playing</Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Playlist
        </Button>
      </div>
    </section>
  );
}

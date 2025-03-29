import { MusicTable } from "@/components/MusicTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select.tsx";
import { usePlaylist } from "@/hooks/react-query.ts";
import { useStore } from "@/zustand/store.ts";
import { useState } from "react";

export default function Playlist() {
  const { playlists } = usePlaylist();
  const [playlistName, setPlaylistName] = useState("");
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  const { setNowPlaying } = useStore((state) => state.actions);
  const handleListen = () => {
    setNowPlaying(playlists.get(playlistName) || []);
  };
  return (
    <section>
      <h2 className="text-2xl font-bold">Playlist</h2>
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
      <Button onClick={handleListen}>Listen</Button>
    </section>
  );
}

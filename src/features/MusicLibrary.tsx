import { MusicTable } from "@/components/MusicTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useMusicLibrary, usePlaylist } from "@/hooks/react-query.ts";
import { useState } from "react";

export default function MusicLibrary() {
  const { musicLibrary } = useMusicLibrary();
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  const { createPlaylist } = usePlaylist();

  const handleAddPlaylist = () => {
    const playlistName = prompt("Enter playlist name");
    if (!playlistName) return;
    createPlaylist({ playlistName, musics: Object.keys(selection).map((key) => musicLibrary[Number(key)]) });
  };
  return (
    <section>
      <h2 className="text-2xl font-bold">Music Library</h2>
      <MusicTable musics={musicLibrary} selection={selection} onSelectionChange={setSelection} />
      <Button onClick={handleAddPlaylist}>Add Playlist</Button>
    </section>
  );
}

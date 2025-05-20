import { MusicTable } from "@/components/music-table";
import { Button } from "@/components/ui/button.tsx";
import { useMusicLibrary, usePlaylist } from "@/hooks/react-query.ts";
import { isEmpty } from "@/lib/sw-toolkit/utils/utils.ts";
import { cacheMusics } from "@/utils/service-worker";
import { useRef, useState } from "react";

export default function MusicLibrary() {
  const { musicLibrary } = useMusicLibrary();
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  const { createPlaylist } = usePlaylist();
  const cacheProgreesDialogRef = useRef<HTMLDialogElement | null>(null);
  const [dialogText, setDialogText] = useState<string>("");

  const handleAddPlaylist = () => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
    const playlistName = prompt("Enter playlist name", formattedDate);
    if (isEmpty(playlistName)) return;
    createPlaylist({ playlistName, musics: Object.keys(selection).map((key) => musicLibrary[Number(key)]) });
  };
  return (
    <section className="w-dvw">
      <MusicTable musics={musicLibrary} selection={selection} onSelectionChange={setSelection} />
      <Button onClick={handleAddPlaylist}>Add Playlist</Button>
      <Button
        onClick={() =>
          cacheMusics(
            musicLibrary,
            () => cacheProgreesDialogRef.current!.showModal(),
            (text) => setDialogText(text)
          )
        }
      >
        Cache{" "}
      </Button>
      <dialog ref={cacheProgreesDialogRef}>{dialogText}</dialog>
    </section>
  );
}

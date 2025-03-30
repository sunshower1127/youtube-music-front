import { MusicTable } from "@/components/MusicTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useStore } from "@/zustand/store.ts";
import { useState } from "react";

export default function NowPlaying() {
  const nowPlaying = useStore((state) => state.nowPlaying);
  const { setNowPlayingIndex, shuffleNowPlaying, removeMusics, clearNowPlaying } = useStore((state) => state.actions);
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  return (
    <section className="w-dvw flex flex-col gap-2">
      <MusicTable musics={nowPlaying} selection={selection} onSelectionChange={setSelection} onRowClick={setNowPlayingIndex} />
      <div className="flex flex-row gap-2">
        <Button onClick={() => shuffleNowPlaying()}>Shuffle</Button>
        <Button variant="destructive" onClick={() => removeMusics(selection)}>
          Delete Selected Music
        </Button>
        <Button variant="destructive" onClick={() => clearNowPlaying()}>
          Clear
        </Button>
      </div>
    </section>
  );
}

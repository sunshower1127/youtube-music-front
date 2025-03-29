import { MusicTable } from "@/components/MusicTable.tsx";
import { useStore } from "@/zustand/store.ts";
import { useState } from "react";

export default function NowPlaying() {
  const nowPlaying = useStore((state) => state.nowPlaying);
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  return (
    <section>
      <h2 className="text-2xl font-bold">Now Playing</h2>
      <MusicTable musics={nowPlaying} selection={selection} onSelectionChange={setSelection} />
    </section>
  );
}

import { MusicTable } from "@/components/music-table";
import { Button } from "@/components/ui/button.tsx";
import { Music } from "@/types/music.ts";
import { useStore } from "@/zustand/store.ts";
import { RowModel, SortingState } from "@tanstack/react-table";
import { isEqual } from "es-toolkit";

import { useEffect, useState } from "react";

export default function NowPlaying() {
  const nowPlaying = useStore((state) => state.nowPlaying);
  const { setNowPlayingIndex, shuffleNowPlaying, removeMusics, clearNowPlaying, setNowPlaying } = useStore((state) => state.actions);
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowModel, setRowModel] = useState<RowModel<Music>>();

  useEffect(() => {
    try {
      if (rowModel) {
        const newMusics = rowModel.rows.map((row) => row.original);

        if (!isEqual(nowPlaying, newMusics)) {
          console.log("nowplaying changed");
          setNowPlaying(newMusics);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("NowPlaying: " + error.message);
      }
    }
  }, [rowModel, setNowPlaying, nowPlaying]);

  return (
    <section className="w-dvw flex flex-col gap-2">
      <MusicTable
        musics={nowPlaying}
        selection={selection}
        onSelectionChange={setSelection}
        onRowClick={setNowPlayingIndex}
        sorting={sorting}
        setSorting={setSorting}
        setRowModel={setRowModel}
      />
      <div className="flex flex-row gap-2">
        <Button
          onClick={() => {
            shuffleNowPlaying();
            setSorting([]);
          }}
        >
          Shuffle
        </Button>
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

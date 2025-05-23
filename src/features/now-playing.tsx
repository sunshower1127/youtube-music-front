import { MusicTable } from "@/components/music-table";
import { Button } from "@/components/ui/button.tsx";
import { useMusicStore } from "@/features/music/store";
import { Music } from "@/types/music.ts";
import { RowModel, SortingState } from "@tanstack/react-table";
import { isEqual } from "es-toolkit";

import { useEffect, useState } from "react";

export default function NowPlaying() {
  const nowPlaying = useMusicStore((state) => state.nowPlaying);
  const { setNowPlayingIndex, shuffleNowPlaying, removeMusics, clearNowPlaying, setNowPlaying } = useMusicStore((state) => state.actions);
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowModel, setRowModel] = useState<RowModel<Music>>();
  useEffect(() => {
    // 뭔가 sorting 로직하고 결합이 되어있는데 얘 때문에 clear가 안먹힘
    try {
      if (rowModel) {
        const newMusics = rowModel.rows.map((row) => row.original);

        if (newMusics.length === nowPlaying.length && !isEqual(nowPlaying, newMusics)) {
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
      <MusicTable
        musics={nowPlaying}
        selection={selection}
        onSelectionChange={setSelection}
        onRowClick={setNowPlayingIndex}
        sorting={sorting}
        setSorting={setSorting}
        setRowModel={setRowModel}
      />
    </section>
  );
}

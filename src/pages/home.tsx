import MusicPlayer from "@/components/music-player";
import { MusicTable } from "@/components/music-table";
import Playlist from "@/components/playlist";
import { fetchPlaylists } from "@/firebase/firebase";
import { Music } from "@/utils/music";
import { useStore } from "@/zustand/store";
import { useEffect, useState } from "react";

export default function Home() {
  const refreshTrigger = useStore((state) => state.refreshTrigger);
  const { setPlaylist } = useStore((state) => state.actions);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const completeMusicList = await fetchMusicList();
      setPlaylist("All", completeMusicList);

      const playlists = await fetchPlaylists();
      playlists.forEach((musics, title) => {
        setPlaylist(title, musics);
      });
      setIsLoading(false);
    })();
  }, [setPlaylist, refreshTrigger]); // 새로고침용

  return (
    <>
      {isLoading && <div className="fixed inset-0 bg-gray-500 opacity-50 z-10" />}
      <div className="flex flex-col items-center">
        <main className="flex flex-col items-center gap-10 max-w-100">
          <MusicPlayer />
          <Playlist />
          <MusicTable />
        </main>
      </div>
    </>
  );
}

const fetchMusicList = async () => {
  const response = await fetch(`https://ytmdl-music-server.vercel.app/api/list`);
  const json = (await response.json()) as Music[];

  return json;
};

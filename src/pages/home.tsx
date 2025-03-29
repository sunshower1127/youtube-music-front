import MusicLibrary from "@/features/MusicLibrary.tsx";
import MusicPlayer from "@/features/MusicPlayer";
import NowPlaying from "@/features/NowPlaying.tsx";

import Playlist from "@/features/Playlist";
import ErrorBoundary from "@/lib/sw-toolkit/components/ErrorBoundary.tsx";
import { Suspense } from "react";

export default function Home() {
  // useEffect(() => {
  //   (async () => {
  //     setIsLoading(true);
  //     const completeMusicList = await fetchMusicList();
  //     setPlaylist("All", completeMusicList);

  //     const playlists = await fetchPlaylists();
  //     playlists.forEach((musics, title) => {
  //       setPlaylist(title, musics);
  //     });
  //     setIsLoading(false);
  //   })();
  // }, [setPlaylist, refreshTrigger]); // 새로고침용

  return (
    <>
      <main className="flex flex-col items-center w-dvw gap-20">
        <ErrorBoundary>
          <Suspense fallback={<div className="fixed inset-0 bg-gray-500 opacity-50 z-10" />}>
            <MusicPlayer />
            <NowPlaying />
            <Playlist />
            <MusicLibrary />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
}

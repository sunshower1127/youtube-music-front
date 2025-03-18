import MusicPlayer from "@/components/music-player";
import { Music, MusicTable } from "@/components/music-table";
import Playlist from "@/components/playlist";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Suspense, useMemo } from "react";

export default function Home() {
  const musicTableData = useMemo(() => fetchMusicList(), []);
  const playlistData = useMemo(() => fetchPlaylist(), []);

  return (
    <div>
      <MusicPlayer />
      <Suspense>
        <MusicTable promise={musicTableData} />
      </Suspense>
      <Suspense>
        <Playlist promise={playlistData} />
      </Suspense>
    </div>
  );
}

const fetchMusicList = async () => {
  const response = await fetch(`https://ytmdl-music-server.vercel.app/api/list`);
  const json = (await response.json()) as Music[];
  return json;
};

const fetchPlaylist = async () => {
  const querySnapshot = await getDocs(collection(db, "playlists"));
  const result: Map<string, Music[]> = new Map();
  result.set("All", []);

  querySnapshot.forEach((doc) => {
    result.set(doc.id, doc.data().songs);
  });
  return result;
};

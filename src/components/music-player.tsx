import { useStore } from "@/zustand/store";
import { Button } from "./ui/button";

export default function MusicPlayer() {
  const playlist = useStore((state) => state.playlist);
  const author = useStore((state) => state.author);
  const title = useStore((state) => state.title);
  const incrementIndex = useStore((state) => state.incrementIndex);
  const decrementIndex = useStore((state) => state.decrementIndex);
  const playlistTitle = useStore((state) => state.playlistTitle);
  const setPlaylist = useStore((state) => state.setPlaylist);
  const allMusic = useStore((state) => state.allMusic);

  if (playlistTitle === "All" && playlist.length === 0) {
    setPlaylist(allMusic);
  }

  const url = `https://ytmdl-music-server.vercel.app/api?author=${author}&title=${title}`;
  console.log(url);

  return (
    <>
      <h1>{playlistTitle}</h1>
      <h2>{author}</h2>
      <h3>{title}</h3>
      <audio controls autoPlay src={url} onEnded={incrementIndex} />
      <Button onClick={decrementIndex}> {"<<"} </Button>
      <Button onClick={incrementIndex}> {">>"} </Button>
    </>
  );
}

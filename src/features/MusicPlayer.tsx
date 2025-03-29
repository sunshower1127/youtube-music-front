import useRefCallback from "@/lib/sw-toolkit/hooks/useRefCallback.ts";
import r2 from "@/services/r2.ts";
import { useStore } from "@/zustand/store.ts";

export default function MusicPlayer() {
  const nowPlaying = useStore((state) => state.nowPlaying);
  const index = useStore((state) => state.nowPlayingIndex);
  const { prevMusic, nextMusic } = useStore((state) => state.actions);

  const artist = nowPlaying[index]?.artist;
  const title = nowPlaying[index]?.title;
  const musicURL = r2.getMusicURL(nowPlaying[index]);
  const thumbnailURL = r2.getThumbnailURL(nowPlaying[index]);

  console.log("MusicPlayer", { artist, title, musicURL, thumbnailURL });

  const handleRef = useRefCallback<"audio">(
    ({ element }) => {
      if (!("mediaSession" in navigator)) return;

      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        artwork: [{ src: thumbnailURL!, type: "image/webp" }],
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => prevMusic());
      navigator.mediaSession.setActionHandler("nexttrack", () => nextMusic());
      navigator.mediaSession.setActionHandler("play", async () => {
        await element.play();
        // element.pause();
        // await delay(0.5 * second);
        // element.play();
      }); // element.play 만 넣어주면 에러남. play안에 있는 this쪽에서 문제 생기는듯.
      navigator.mediaSession.setActionHandler("pause", () => element.pause());
    },
    [artist, title]
  );

  return (
    <div
      className="flex justify-end flex-col items-center aspect-square w-dvw max-w-100"
      style={{
        backgroundImage: `url(${thumbnailURL})`,
        backgroundSize: "cover",
        textShadow: "2px 2px 2px gray",
      }}
    >
      <div>{/* <p className="font-serif">{currentPlaylist}</p> */}</div>
      <div className="flex flex-row w-full justify-center gap-3 items-center">
        <div className="p-2 pb-3 cursor-pointer" onClick={prevMusic}>
          {"<<"}
        </div>

        <p className=" font-serif">
          {artist} - {title}
        </p>
        <div className="p-2 pb-3 cursor-pointer" onClick={nextMusic}>
          {">>"}
        </div>
      </div>
      <audio className="mb-1 shadow-2xl" ref={handleRef} autoPlay controls src={musicURL!} onEnded={nextMusic} />
    </div>
  );
}

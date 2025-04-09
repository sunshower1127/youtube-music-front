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
      navigator.mediaSession.setActionHandler("play", () => {
        // 현재 오디오가 재생 가능한 상태인지 확인
        if (element.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          element.play();
        } else {
          // 충분한 버퍼가 찰 때까지 기다렸다가 재생
          const onCanPlay = () => {
            element.play();
          };
          element.addEventListener("canplay", onCanPlay, { once: true });
        }
      });
      navigator.mediaSession.setActionHandler("pause", () => element.pause());
    },
    [artist, title]
  );

  return (
    <div
      className="flex justify-end flex-col items-center w-dvw max-w-[calc(100dvh-5.5rem)] aspect-square"
      style={{
        backgroundImage: `url("${thumbnailURL}")`, // 여기서 큰 따옴표로 안감싸주면 url에 있는 작음 따움표가 에러일으킬 수 있음
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
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

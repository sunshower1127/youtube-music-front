import useRefCallback from "@/lib/sw-toolkit/hooks/useRefCallback.ts";
import useSafeEffect from "@/lib/sw-toolkit/hooks/useSafeEffect";
import useSafeInterval from "@/lib/sw-toolkit/hooks/useSafeInterval";
import r2 from "@/services/r2.ts";
import { useStore } from "@/zustand/store.ts";
import { delay } from "es-toolkit";
import { useEffect, useRef } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const nowPlaying = useStore((state) => state.nowPlaying);
  const index = useStore((state) => state.nowPlayingIndex);
  const { prevMusic, nextMusic } = useStore((state) => state.actions);

  const artist = nowPlaying[index]?.artist;
  const title = nowPlaying[index]?.title;
  const musicURL = r2.getMusicURL(nowPlaying[index]);
  const thumbnailURL = r2.getThumbnailURL(nowPlaying[index]);

  const handleRef = useRefCallback<"audio">(
    ({ element, defer }) => {
      audioRef.current = element;

      const handleLoadedMetadata = () => {
        // 트랙이 변경될 때마다 positionState 초기화
        navigator.mediaSession.setPositionState({
          duration: element.duration || 0,
          playbackRate: element.playbackRate,
          position: 0, // 위치를 0으로 초기화
        });
        element.play();
      };

      element.addEventListener("loadedmetadata", handleLoadedMetadata);
      defer(() => element.removeEventListener("loadedmetadata", handleLoadedMetadata));

      if (!navigator.mediaSession) return;
      navigator.mediaSession.setActionHandler("previoustrack", () => prevMusic());
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        nextMusic();
      });
      navigator.mediaSession.setActionHandler("play", () => element.play());
      navigator.mediaSession.setActionHandler("pause", () => element.pause());
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        element.currentTime = details.seekTime!;
        navigator.mediaSession.setPositionState({
          duration: element.duration || 0,
          playbackRate: element.playbackRate,
          position: element.currentTime,
        });
      });
    },
    [musicURL]
  );

  useEffect(() => {
    if (!navigator.mediaSession) return;

    if (!audioRef.current) return;
    audioRef.current.src = musicURL!;

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      artwork: [{ src: thumbnailURL!, type: "image/webp" }],
    });
  }, [artist, musicURL, thumbnailURL, title]);

  // 의미없는 interval로 절전모드 방지?

  useSafeInterval(() => {}, [], 1000);

  useSafeEffect(async ({ isNotMounted }) => {
    while (true) {
      if (isNotMounted()) return;
      await delay(1000);
    }
  }, []);

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
      <audio className="mb-1 shadow-2xl" ref={handleRef} controls src={musicURL!} onEnded={nextMusic} />
    </div>
  );
}

import useRefCallback from "@/lib/sw-toolkit/hooks/useRefCallback.ts";
import r2 from "@/services/r2.ts";
import { useStore } from "@/zustand/store.ts";

export default function MusicPlayer() {
  const nowPlaying = useStore((state) => state.nowPlaying);
  const index = useStore((state) => state.nowPlayingIndex);
  const { prevMusic, nextMusic, addErrorLog } = useStore((state) => state.actions);

  const artist = nowPlaying[index]?.artist;
  const title = nowPlaying[index]?.title;
  const musicURL = r2.getMusicURL(nowPlaying[index]);
  const thumbnailURL = r2.getThumbnailURL(nowPlaying[index]);

  const handleRef = useRefCallback<"audio">(
    ({ element }) => {
      if (!("mediaSession" in navigator)) {
        addErrorLog("Media Session is not detected");
        return;
      }

      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title,
          artist,
          artwork: [{ src: thumbnailURL!, type: "image/webp" }],
        });

        navigator.mediaSession.setActionHandler("previoustrack", () => {
          try {
            prevMusic();
          } catch (error) {
            if (error instanceof Error) {
              addErrorLog("MusicPlayer:previoustrack: " + error.message);
            }
          }
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          try {
            nextMusic();
          } catch (error) {
            if (error instanceof Error) {
              addErrorLog("MusicPlayer:nexttrack: " + error.message);
            }
          }
        });
        navigator.mediaSession.setActionHandler("play", () => {
          try {
            // 현재 오디오가 재생 가능한 상태인지 확인
            if (element.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
              element.play().catch((error) => {
                if (error instanceof Error) {
                  addErrorLog("MusicPlayer:play: " + error.message);
                }
              });
            } else {
              addErrorLog("MusicPlayer:play: Not enough data to play");
              // 충분한 버퍼가 찰 때까지 기다렸다가 재생
              const onCanPlay = () => {
                element.play().catch((error) => {
                  if (error instanceof Error) {
                    addErrorLog("MusicPlayer:play: " + error.message);
                  }
                });
              };
              element.addEventListener("canplay", onCanPlay, { once: true });
            }
          } catch (error) {
            if (error instanceof Error) {
              addErrorLog("MusicPlayer:play: " + error.message);
            }
          }
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          try {
            element.pause();
          } catch (error) {
            if (error instanceof Error) {
              addErrorLog("MusicPlayer:pause: " + error.message);
            }
          }
        });
      } catch (error) {
        if (error instanceof Error) {
          addErrorLog("MusicPlayer: " + error.message);
        }
      }
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

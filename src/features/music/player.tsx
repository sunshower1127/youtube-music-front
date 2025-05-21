import { useMusicStore } from "@/features/music/store";
import { getThumbnailURL } from "@/services/r2";
import audio from "./audio";

export default function MusicPlayer() {
  const nowPlaying = useMusicStore((state) => state.nowPlaying);
  const index = useMusicStore((state) => state.nowPlayingIndex);
  const { prevMusic, nextMusic } = useMusicStore((state) => state.actions);

  const artist = nowPlaying[index]?.artist;
  const title = nowPlaying[index]?.title;
  const thumbnailURL = getThumbnailURL(nowPlaying[index]);

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
      <div className="mb-1 flex flex-row gap-2">
        <div className="text-2xl cursor-pointer" onClick={() => audio.play()}>
          ▶️
        </div>
        <div className="text-2xl cursor-pointer" onClick={() => audio.pause()}>
          ⏸️
        </div>
      </div>
    </div>
  );
}

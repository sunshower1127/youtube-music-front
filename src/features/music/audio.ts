import { getMusicURL, getThumbnailURL } from "@/services/r2";
import { delay } from "es-toolkit";
import { useMusicStore } from "./store";

export const audio = new Audio();
const { prevMusic, nextMusic } = useMusicStore.getState().actions;

audio.src = getMusicURL(useMusicStore.getState().nowPlaying[useMusicStore.getState().nowPlayingIndex]) || "";

// Zustand 상태 구독 설정
useMusicStore.subscribe(({ nowPlaying, nowPlayingIndex }) => {
  const track = nowPlaying[nowPlayingIndex];
  if (!track) return;
  const musicURL = getMusicURL(track);
  if (!musicURL) return;
  audio.src = musicURL;
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      artwork: [{ src: getThumbnailURL(track)!, type: "image/webp" }],
    });
  }
  audio.load();
  audio.play();
});

function play() {
  audio.play();
}

function pause() {
  audio.pause();
}

audio.addEventListener("ended", () => nextMusic());

// 방법 1 -> 이러면 prevtrack, nexttrack 버튼이 제대로 보임. 근데 끊길 가능성?

const handlePlaying = () => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.setActionHandler("previoustrack", () => prevMusic());
    navigator.mediaSession.setActionHandler("nexttrack", () => nextMusic());
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime) {
        audio.currentTime = details.seekTime;
      }
    });
  }
};
audio.addEventListener("playing", () => handlePlaying());

// 방법 2 -> nexttrack 버튼이 이러면 안보임. 대신에 seekto가 잘 작동함.
// 에어팟으로 넘기는건 잘됨. 안끊길 가능성이 있기에 일단 이걸로 함.
// 왜인진 모르겠지만 seekto 추가하면 꼬이고
// if ("mediaSession" in navigator) {
//   navigator.mediaSession.setActionHandler("play", play);
//   navigator.mediaSession.setActionHandler("pause", pause);
//   navigator.mediaSession.setActionHandler("previoustrack", () => prevMusic());
//   navigator.mediaSession.setActionHandler("nexttrack", () => nextMusic());
// }

function cacheAll(showDialog: () => void, closeDialog: () => void, setDialogText: (text: string) => void) {
  const track = useMusicStore.getState().nowPlaying;
  const { setNowPlayingIndex } = useMusicStore.getState().actions;
  setNowPlayingIndex(0);
  showDialog();

  let i = 0;

  const next = async () => {
    setDialogText(`Caching track ${i} / ${track.length}...`);
    await delay(1000); // 1초 대기
    if (i == track.length) {
      audio.removeEventListener("playing", next);
      setDialogText(`All tracks cached successfully!`);
      await delay(2000);
      closeDialog();
      return;
    }
    nextMusic();
    i++;
  };

  audio.addEventListener("playing", next);
  audio.play();
}

export default {
  play,
  pause,
  cacheAll,
};

import { getMusicURL, getThumbnailURL } from "@/services/r2";
import { once } from "es-toolkit";
import { useMusicStore } from "./store";

export const audio = new Audio();
const { prevMusic, nextMusic } = useMusicStore.getState().actions;

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

const handlePlaying = once(() => {
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
});
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

export default {
  play,
  pause,
};

import { getMusicURL } from "@/services/r2";
import { Music } from "@/types/music";

export function cacheMusics(musics: Music[], showModal: () => void, setDialogText: (text: string) => void) {
  // 서비스 워커와 캐시가 지원되는지 확인
  if (!("serviceWorker" in navigator) || !("caches" in window)) {
    setDialogText("이 브라우저는 오프라인 캐싱을 지원하지 않습니다.");
    showModal();
    return;
  }

  showModal();
  setDialogText("음악 파일 캐싱 준비 중...");

  (async () => {
    try {
      const cache = await caches.open("music");
      let cached = 0;
      let alreadyCached = 0;
      const total = musics.length;

      for (let i = 0; i < total; i++) {
        const music = musics[i];
        const url = getMusicURL(music);

        if (!url) continue;

        // 현재 진행 상황 업데이트
        setDialogText(`음악 캐싱 중: ${i + 1}/${total} (${cached} 추가됨, ${alreadyCached} 이미 캐시됨)`);

        // 이미 캐시에 있는지 확인
        const cachedResponse = await cache.match(url);
        if (cachedResponse) {
          alreadyCached++;
          continue;
        }

        try {
          // 실제로 파일을 재생하지 않고 헤더만 가져와 캐싱
          const response = await fetch(url, { method: "GET" });
          if (response.ok) {
            await cache.put(url, response);
            cached++;
          }
        } catch (error) {
          console.error(`'${music.artist} - ${music.title}' 캐싱 실패:`, error);
        }
      }

      setDialogText(`캐싱 완료! ${cached}개의 새 음악이 캐시되었습니다. ${alreadyCached}개는 이미 캐시되어 있었습니다.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("음악 캐싱 중 오류 발생:", error);
        setDialogText(`음악 캐싱 중 오류가 발생했습니다: ${error.message}`);
      }
    }
  })();
}

import { Music, MusicTable } from "@/components/music-table";
import { useStore } from "@/zustand/store";
import { Suspense, useEffect, useMemo, useRef } from "react";

export default function Home() {
  const title = useStore((state) => state.title);
  const author = useStore((state) => state.author);
  const volume = useStore((state) => state.volume);
  const setVolume = useStore((state) => state.setVolume);
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicList = useMemo(async () => {
    const response = await fetch(`https://ytmdl-music-server.vercel.app/api/list`);
    const json = (await response.json()) as Music[];
    return json;
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const url = `https://ytmdl-music-server.vercel.app/api?author=${author}&title=${title}`;

  return (
    <div>
      <audio
        ref={audioRef}
        onVolumeChange={(e) => {
          setVolume(e.currentTarget.volume);
        }}
        controls
        autoPlay
        src={url}
      />
      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
      <Suspense>
        <MusicTable promise={musicList} />
      </Suspense>
    </div>
  );
}

// import { useState } from "react";
// import styles from "./home.module.css"; // 스타일링을 위한 CSS 모듈 (만들어야 함)

// export default function Home() {
//   const [author, setAuthor] = useState("");
//   const [title, setTitle] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   // const [audioUrl, setAudioUrl] = useState<string | null>(null);

//   const handleClick = async () => {
//     if (!author || !title) {
//       setError("가수와 곡명을 모두 입력해주세요");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       // const response = await fetch(`https://ytmdl-music-server.vercel.app/api?author=${encodeURIComponent(author)}&title=${encodeURIComponent(title)}`);

//       // if (!response.ok) {
//       //   throw new Error("음악을 찾을 수 없습니다");
//       // }

//       // // 변경: blob() 대신 arrayBuffer()로 응답받고, audio/webm 타입의 Blob으로 변환
//       // const buffer = await response.arrayBuffer();
//       // const blob = new Blob([buffer], { type: "audio/webm" });
//       // const url = URL.createObjectURL(blob);
//       // setAudioUrl(url);

//       const audio = document.querySelector("audio") as HTMLAudioElement;
//       audio.src = `https://ytmdl-music-server.vercel.app/api?author=${encodeURIComponent(author)}&title=${encodeURIComponent(title)}`;
//       audio.play();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "오류가 발생했습니다");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <main className={styles.container}>
//       <h1 className={styles.title}>YouTube Music Clone</h1>
//       <div className={styles.formGroup}>
//         <label htmlFor="author" className={styles.label}>
//           가수
//         </label>
//         <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className={styles.input} placeholder="가수 이름을 입력하세요" disabled={isLoading} />
//       </div>
//       <div className={styles.formGroup}>
//         <label htmlFor="title" className={styles.label}>
//           곡명
//         </label>
//         <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} placeholder="곡명을 입력하세요" disabled={isLoading} />
//       </div>
//       <button onClick={handleClick} className={styles.button} disabled={isLoading || !author || !title}>
//         {isLoading ? "검색 중..." : "음악 검색"}
//       </button>
//       {error && <div className={styles.error}>{error}</div>}(
//       <div className={styles.audioContainer}>
//         <audio controls className={styles.audioPlayer} autoPlay />
//         <p className={styles.nowPlaying}>
//           현재 재생 중: {author} - {title}
//         </p>
//       </div>
//       )
//     </main>
//   );
// }

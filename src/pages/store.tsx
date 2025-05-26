import { useEffect, useState } from "react";

interface CacheItem {
  url: string;
  artist?: string;
  title?: string;
}

export default function StorePage() {
  const [cacheKeys, setCacheKeys] = useState<CacheItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL에서 아티스트와 제목 파라미터 추출하는 함수
  const extractMusicInfo = (url: string): { artist?: string; title?: string } => {
    try {
      const urlObj = new URL(url);
      const artist = urlObj.searchParams.get("artist");
      const title = urlObj.searchParams.get("title");
      return {
        artist: artist ? decodeURIComponent(artist) : undefined,
        title: title ? decodeURIComponent(title) : undefined,
      };
    } catch {
      return {};
    }
  };

  useEffect(() => {
    async function fetchCacheKeys() {
      try {
        setIsLoading(true);

        // 캐시 스토리지에서 'music' 캐시 열기
        const cache = await caches.open("music");

        // 모든 캐시된 요청 가져오기
        const requests = await cache.keys();

        // 요청 URL에서 정보 추출
        const items: CacheItem[] = requests.map((request) => {
          const url = request.url;
          const { artist, title } = extractMusicInfo(url);

          return { url, artist, title };
        });

        setCacheKeys(items);
      } catch (err) {
        console.error("캐시 항목을 가져오는 중 오류 발생:", err);
        setError("캐시 데이터를 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCacheKeys();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center p-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">음악 캐시 목록</h1>

      {cacheKeys.length === 0 ? (
        <p>캐시된 음악 파일이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="">
              <tr>
                <th className="py-2 px-4 border-b text-left">아티스트</th>
                <th className="py-2 px-4 border-b text-left">제목</th>
              </tr>
            </thead>
            <tbody>
              {cacheKeys.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-800" : ""}>
                  <td className="py-2 px-4 border-b">{item.artist || "-"}</td>
                  <td className="py-2 px-4 border-b">{item.title || "-"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="">
              <tr>
                <td className="py-2 px-4 border-t font-bold">총계</td>
                <td className="py-2 px-4 border-t font-bold text-right">{cacheKeys.length}개 항목</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

import { useStore } from "@/zustand/store";

export default function ErrorPage() {
  const errorLog = useStore((state) => state.errorLog);
  const clearErrorLog = useStore((state) => state.actions.clearErrorLog);
  return (
    <div>
      <h1 className="text-3xl">에러 페이지</h1>
      <ul className="flex flex-col gap-2">
        {errorLog.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => {
          clearErrorLog();
        }}
      >
        에러 로그 초기화
      </button>
    </div>
  );
}

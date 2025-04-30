import Layout from "@/pages/_layout.tsx";
import ErrorPage from "@/pages/error-page";
import LibraryPage from "@/pages/library.tsx";
import NowPlayingPage from "@/pages/now-playing.tsx";
import PlaylistPage from "@/pages/playlist.tsx";
import { BrowserRouter, Route, Routes } from "react-router";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<NowPlayingPage />} />
          <Route path="playlist" element={<PlaylistPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="error-page" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

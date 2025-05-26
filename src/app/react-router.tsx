import Layout from "@/pages/_layout.tsx";

import LibraryPage from "@/pages/library.tsx";
import NowPlayingPage from "@/pages/now-playing.tsx";
import PlaylistPage from "@/pages/playlist.tsx";
import StorePage from "@/pages/store";
import { BrowserRouter, Route, Routes } from "react-router";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<NowPlayingPage />} />
          <Route path="playlist" element={<PlaylistPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="store" element={<StorePage />} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

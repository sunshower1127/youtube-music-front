import MusicPlayer from "@/features/music/player";
import ErrorBoundary from "@/lib/sw-toolkit/components/ErrorBoundary.tsx";
import { CassetteTape, Disc3, SquareLibrary, Store } from "lucide-react";
import { Suspense } from "react";
import { NavLink, Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex flex-col mb-30 gap-10 items-center">
      <MusicPlayer />
      <ErrorBoundary>
        <Suspense>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
      <nav className="fixed inset-x-0 bottom-0 bg-zinc-950 border-t-[0.5px] border-zinc-400 pt-1">
        <ul className="flex justify-around **:text-[0.7rem] **:stroke-1 *:w-20">
          <li>
            <NavLink className="flex flex-col items-center h-20" to="/">
              <Disc3 />
              <span className="">Now Playing</span>
            </NavLink>
          </li>
          <li>
            <NavLink className="flex flex-col items-center h-20" to="/playlist">
              <CassetteTape />
              <span className="">Playlist</span>
            </NavLink>
          </li>
          <li>
            <NavLink className="flex flex-col items-center h-20" to="/library">
              <SquareLibrary />
              <span className="">Library</span>
            </NavLink>
          </li>
          <li>
            <NavLink className="flex flex-col items-center h-20" to="/store">
              <Store />
              <span className="">Store</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

import { convertKeysToCamelCase } from "@/lib/sw-toolkit/utils/string.ts";
import { Music } from "@/types/music";
import ky from "ky";

const URL = "https://ytmdl-music-server.vercel.app/api";

async function getMusicLibrary() {
  const data = await ky.get(URL, {}).json<Music[]>();
  return data.map((music) => ({
    ...music,
    metadata: convertKeysToCamelCase(music.metadata),
  })) as Music[];
}

function getThumbnailURL(music: Music) {
  if (!music) return null;
  return `${URL}/thumbnail?artist=${encodeURIComponent(music.artist)}&title=${encodeURIComponent(music.title)}`;
}

export function getMusicURL(music: Music) {
  if (!music) return null;
  return `${URL}/music?artist=${encodeURIComponent(music.artist)}&title=${encodeURIComponent(music.title)}`;
}

export default {
  getMusicLibrary,
  getThumbnailURL,
  getMusicURL,
};

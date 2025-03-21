// Import the functions you need from the SDKs you need
import { Music } from "@/utils/music";
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseConfig } from "./constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const fetchPlaylists = async () => {
  const querySnapshot = await getDocs(query(collection(db, "playlists"), orderBy("createdAt", "desc")));
  const playlists: Map<string, Music[]> = new Map();

  querySnapshot.forEach((doc) => {
    playlists.set(doc.id.replace(/\\/g, "/"), doc.data().musics);
  });
  return playlists;
};

export const removePlaylist = (title: string) => {
  title = title.replace(/\//g, "\\"); // Firestore에서 /를 사용할 수 없음
  const docRef = doc(db, "playlists", title);
  deleteDoc(docRef); // 왜 여기에 await 붙이면 무한로딩 걸리는거임? 진짜 모르겠네
};

export const addPlaylist = async (title: string, musics: Music[]) => {
  title = title.replace(/\//g, "\\"); // Firestore에서 /를 사용할 수 없음
  const docRef = doc(db, "playlists", title);

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    alert("Playlist already exists");
    return;
  }

  await setDoc(docRef, {
    createdAt: serverTimestamp(),
    musics: musics.map(({ author, title, thumbnailColorcode, musicValue }) => ({ author, title, thumbnailColorcode, musicValue })),
  });
};

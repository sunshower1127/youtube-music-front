// Import the functions you need from the SDKs you need
import { Music } from "@/utils/music";
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { firebaseConfig } from "./constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const fetchPlaylists = async () => {
  const querySnapshot = await getDocs(collection(db, "playlists"));
  const playlists: Map<string, Music[]> = new Map();

  querySnapshot.forEach((doc) => {
    playlists.set(doc.id, doc.data().musics);
  });
  return playlists;
};

export const removePlaylist = async (title: string) => {
  const docRef = doc(db, "playlists", title);
  await deleteDoc(docRef);
};

export const setPlaylist = async (title: string, musics: Music[]) => {
  const docRef = doc(db, "playlists", title);
  await setDoc(docRef, { musics: musics.map(({ author, title }) => ({ author, title })) });
};

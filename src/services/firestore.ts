// Import the functions you need from the SDKs you need
import { firebaseConfig } from "@/services/secrets/firebase-config";
import { Music } from "@/types/music";
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchPlaylists() {
  const querySnapshot = await getDocs(query(collection(db, "playlists"), orderBy("createdAt", "desc")));
  const playlists: Map<string, Music[]> = new Map();

  querySnapshot.forEach((doc) => {
    playlists.set(doc.id.replace(/\\/g, "/"), doc.data().musics);
  });
  return playlists;
}

async function deletePlaylist(playlistName: string) {
  playlistName = playlistName.replace(/\//g, "\\"); // Firestore에서 /를 사용할 수 없음
  const docRef = doc(db, "playlists", playlistName);
  deleteDoc(docRef); // 왜 여기에 await 붙이면 무한로딩 걸리는거임? 진짜 모르겠네
}

async function createPlaylist(playlistName: string, musics: Music[]) {
  playlistName = playlistName.replace(/\//g, "\\"); // Firestore에서 /를 사용할 수 없음
  const docRef = doc(db, "playlists", playlistName);

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    alert("Playlist already exists");
    return;
  }

  setDoc(docRef, { createdAt: serverTimestamp(), musics });
}

async function updatePlaylist(playlistName: string, musics: Music[]) {
  playlistName = playlistName.replace(/\//g, "\\"); // Firestore에서 /를 사용할 수 없음
  const docRef = doc(db, "playlists", playlistName);

  updateDoc(docRef, { musics });
}

export default {
  fetchPlaylists,
  deletePlaylist,
  createPlaylist,
  updatePlaylist,
};

import app from "../config/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage(app);

export default function uploadMedia(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }
    const uniqueName = `${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `gallery/${uniqueName}`);

    uploadBytes(fileRef, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => resolve(url))
      .catch((err) => reject(err));
  });
}
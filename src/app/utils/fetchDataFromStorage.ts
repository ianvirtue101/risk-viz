import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const fetchDataFromStorage = async (file_path: string) => {
  const storage = getStorage();
  const fileRef = ref(storage, file_path);

  const downloadURL = await getDownloadURL(fileRef);

  return downloadURL;
};

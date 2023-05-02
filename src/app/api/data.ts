// import data from firestore
import firebase_app from "../../firebase/config";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Get a document, returning the data or null if it does not exist.
const db = getFirestore(firebase_app);
export default async function getDocument(collection: any, id: any) {
  let docRef = doc(db, collection, id);

  let result = null;
  let error = null;

  try {
    result = await getDoc(docRef);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

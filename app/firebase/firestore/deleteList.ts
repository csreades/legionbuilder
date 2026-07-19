import { db } from "../config"
import { doc, deleteDoc } from "firebase/firestore"
import { LOCAL_MODE, localDeleteList } from "@/app/localMode"

export const deleteList = async (listId: string) => {
	if (LOCAL_MODE) return localDeleteList(listId)
	await deleteDoc(doc(db, process.env.NEXT_PUBLIC_FIREBASE_LIST_DB!, listId))
}

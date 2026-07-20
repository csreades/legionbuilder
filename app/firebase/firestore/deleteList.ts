import { db } from "../config"
import { doc, deleteDoc } from "firebase/firestore"
import { LOCAL_MODE } from "@/app/localMode"
import { deleteListFromServer } from "@lists/serverStore"

export const deleteList = async (listId: string) => {
	if (LOCAL_MODE) return deleteListFromServer(listId)
	await deleteDoc(doc(db, process.env.NEXT_PUBLIC_FIREBASE_LIST_DB!, listId))
}

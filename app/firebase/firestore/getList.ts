import { db } from "../config"
import { doc, getDoc } from "firebase/firestore"
import { LOCAL_MODE } from "@/app/localMode"
import { fetchList } from "@lists/serverStore"

export const getList = async (listId: string) => {
	if (LOCAL_MODE) return fetchList(listId)
	const data = await getDoc(doc(db, process.env.NEXT_PUBLIC_FIREBASE_LIST_DB!, listId))
	if (data.exists()) {
		return JSON.parse(data.data().list)
	}
	return null
}

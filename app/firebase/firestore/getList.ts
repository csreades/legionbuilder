import { db } from "../config"
import { doc, getDoc } from "firebase/firestore"
import { LOCAL_MODE, localGetList } from "@/app/localMode"

export const getList = async (listId: string) => {
	if (LOCAL_MODE) return localGetList(listId)
	const data = await getDoc(doc(db, process.env.NEXT_PUBLIC_FIREBASE_LIST_DB!, listId))
	if (data.exists()) {
		return JSON.parse(data.data().list)
	}
	return null
}

import { List } from "@type//listTypes"
import { db } from "@/app/firebase/config"
import { setDoc, doc, serverTimestamp } from "firebase/firestore"
import checkUploadPermission from "@/app/firebase/firestore/checkUploadPermission"
import { LOCAL_MODE } from "@/app/localMode"
import { saveListToServer } from "@lists/serverStore"

export const saveData = async (listData: List) => {
	if (LOCAL_MODE) return saveListToServer(listData)
	try {
		const permission = await checkUploadPermission(listData)
		if (!permission) {
			return { uploaded: false, message: "Too many lists!" }
		} else {
			try {
				const listString = JSON.stringify(listData)
				const listRef = doc(db, process.env.NEXT_PUBLIC_FIREBASE_LIST_DB!, listData.id)
				await setDoc(listRef, {
					list: listString,
					owner: listData.user,
					created: serverTimestamp(),
					game_size: listData.points,
					main_faction: listData.faction,
					name: listData.name,
					formations: listData.formations.length,
				}),
					{ merge: true }
				return { uploaded: true, message: "List saved to account" }
			} catch (error) {
				return { uploaded: false, message: "Failed to save list" }
			}
		}
	} catch (error) {
		return { uploaded: false, message: "Failed to connect" }
	}
}

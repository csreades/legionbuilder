"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { userListsState } from "@lists/state"
import { LOCAL_MODE, parseImportedList } from "@/app/localMode"
import { fetchUserLists, saveListToServer } from "@lists/serverStore"

// Local-mode only: paste a list's JSON (a raw List object, or a Firestore document
// with a stringified `list` field) to store it locally under the local user.
const ImportList = () => {
	const [open, setOpen] = useState(false)
	const [text, setText] = useState("")
	const { setUserLists } = userListsState()

	if (!LOCAL_MODE) return null

	const handleImport = async () => {
		try {
			const list = parseImportedList(text)
			await saveListToServer(list)
			setUserLists(await fetchUserLists())
			setText("")
			setOpen(false)
			toast.success(`Imported "${list.name}"`)
		} catch (error) {
			toast.error("Could not parse list JSON")
		}
	}

	return (
		<div className="w-full flex flex-col gap-2 py-2">
			<button
				onClick={() => setOpen(!open)}
				className="self-start clip-path-halfagon-md py-1 px-2 bg-backgrounds-900 hover:text-primary-400 active:text-primary-400 font-graduate">
				{open ? "Cancel import" : "Import list"}
			</button>
			{open ? (
				<div className="flex flex-col gap-2">
					<textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Paste list JSON here"
						className="text-secondary-200 bg-secondary-700 w-full p-2 h-40 font-mono text-xs"
					/>
					<button
						onClick={handleImport}
						disabled={!text.trim()}
						className="self-start bg-primary-500 clip-path-halfagon-sm py-1 px-4 text-primary-100 font-semibold font-graduate disabled:opacity-50">
						Save locally
					</button>
				</div>
			) : null}
		</div>
	)
}

export default ImportList

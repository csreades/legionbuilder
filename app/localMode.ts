import { List } from "@type/listTypes"
import { DB_ENTRY } from "@type/types"
import seedLists from "@data/seedLists.json"

// Local single-user dev mode. When NEXT_PUBLIC_LOCAL_MODE=true the app skips
// Firebase entirely: a single "dev" user is auto logged in and all lists are
// persisted in the browser's localStorage instead of Firestore. This lets the
// tool run fully offline with no third-party database, for local development.
export const LOCAL_MODE = process.env.NEXT_PUBLIC_LOCAL_MODE === "true"
export const LOCAL_UID = "dev"

const STORAGE_KEY = "local_lists"

interface LocalEntry {
	list: List
	created: number
}

const readStore = (): Record<string, LocalEntry> => {
	if (typeof window === "undefined") return {}
	try {
		return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}")
	} catch {
		return {}
	}
}

const writeStore = (store: Record<string, LocalEntry>) => {
	if (typeof window === "undefined") return
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export const localSaveList = (list: List) => {
	const store = readStore()
	const created = store[list.id]?.created ?? Date.now()
	store[list.id] = { list: { ...list, user: LOCAL_UID }, created }
	writeStore(store)
	return { uploaded: true, message: "List saved locally" }
}

export const localGetList = (id: string): List | null => {
	const list = readStore()[id]?.list
	// Normalise ownership to the current dev user so saving updates in place
	// (rather than forking a copy) even for lists stored under an older uid.
	return list ? { ...list, user: LOCAL_UID } : null
}

export const localDeleteList = (id: string) => {
	const store = readStore()
	delete store[id]
	writeStore(store)
}

export const localGetUserLists = (): DB_ENTRY[] => {
	seedLocalLists() // ensure bundled lists are present before the first listing
	return Object.values(readStore()).map((entry) => ({
		list: { ...entry.list, user: LOCAL_UID }, // normalise ownership to the dev user
		name: entry.list.name,
		main_faction: entry.list.faction,
		game_size: entry.list.points,
		formations: entry.list.formations.length,
		// DB_ENTRY.created is a Firestore Timestamp in cloud mode; locally we use a
		// plain millisecond number. The only consumer is the "created" sort, which
		// does Number(created), so a number sorts correctly.
		created: entry.created as unknown as DB_ENTRY["created"],
	}))
}

// One-time seed of bundled starter lists (e.g. lists imported from the cloud app)
// into local storage. Runs once per browser, tracked by a flag so deleting a
// seeded list doesn't make it reappear.
const SEED_FLAG = "local_seeded"
export const seedLocalLists = () => {
	if (typeof window === "undefined") return
	if (window.localStorage.getItem(SEED_FLAG)) return
	const store = readStore()
	for (const list of seedLists as unknown as List[]) {
		if (!store[list.id]) {
			store[list.id] = { list: { ...list, user: LOCAL_UID }, created: Date.now() }
		}
	}
	writeStore(store)
	window.localStorage.setItem(SEED_FLAG, "true")
}

// --- Model collection ("Compare Collection" tool), stored locally ---

const COLLECTION_KEY = "local_collection"

export const localGetCollection = (): { owner: string; collection: unknown[] }[] => {
	if (typeof window === "undefined") return []
	try {
		const stored = window.localStorage.getItem(COLLECTION_KEY)
		return stored ? [JSON.parse(stored)] : []
	} catch {
		return []
	}
}

export const localSaveCollection = (collection: { owner: string; collection: unknown[] }) => {
	if (typeof window !== "undefined") {
		window.localStorage.setItem(COLLECTION_KEY, JSON.stringify({ ...collection, owner: LOCAL_UID }))
	}
	return { uploaded: true, message: "Collection saved locally" }
}

// Accepts either a raw List object or a Firestore document shape ({ list: "<json>" }),
// pasted as text. Returns a normalised List or throws on invalid input.
export const parseImportedList = (raw: string): List => {
	const parsed = JSON.parse(raw)
	const list: List = typeof parsed.list === "string" ? JSON.parse(parsed.list) : parsed
	if (!list || !Array.isArray(list.formations)) {
		throw new Error("Not a valid list")
	}
	return { ...list, user: LOCAL_UID }
}

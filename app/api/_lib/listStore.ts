import { promises as fs } from "fs"
import path from "path"
import { List } from "@type/listTypes"
import seedLists from "@data/seedLists.json"
import { isProtectedList } from "@lists/protectedLists"

// Server-side list store for dev mode: a single JSON file on the server so all
// clients share the same lists (no third-party database). Seeded once from the
// bundled seed list.
const FILE = path.join(process.cwd(), ".local", "lists.json")
const DEV_UID = "dev"

interface Entry {
	list: List
	created: number
}

const write = async (store: Record<string, Entry>) => {
	await fs.mkdir(path.dirname(FILE), { recursive: true })
	await fs.writeFile(FILE, JSON.stringify(store, null, 2))
}

// Read the store, seeding from the bundled list on first run.
const read = async (): Promise<Record<string, Entry>> => {
	try {
		return JSON.parse(await fs.readFile(FILE, "utf8"))
	} catch {
		const store: Record<string, Entry> = {}
		for (const list of seedLists as unknown as List[]) {
			store[list.id] = { list: { ...list, user: DEV_UID }, created: Date.now() }
		}
		await write(store)
		return store
	}
}

export const listAll = async (): Promise<Entry[]> => Object.values(await read())

export const getOne = async (id: string): Promise<List | null> => (await read())[id]?.list ?? null

export const saveOne = async (list: List) => {
	if (isProtectedList(list.id)) return { uploaded: false, message: "This list is read-only" }
	const store = await read()
	store[list.id] = { list: { ...list, user: DEV_UID }, created: store[list.id]?.created ?? Date.now() }
	await write(store)
	return { uploaded: true, message: "List saved to server" }
}

// Returns false if the list is protected (and therefore not deleted).
export const deleteOne = async (id: string): Promise<boolean> => {
	if (isProtectedList(id)) return false
	const store = await read()
	delete store[id]
	await write(store)
	return true
}

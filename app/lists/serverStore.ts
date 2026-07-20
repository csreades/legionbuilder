import { DB_ENTRY } from "@type/types"
import { List } from "@type/listTypes"

// Client-side wrappers around the server list API (dev mode). Lists live on the
// server so they're shared: anyone landing on the page sees the same lists.

export const fetchUserLists = async (): Promise<DB_ENTRY[]> => {
	const res = await fetch("/api/lists", { cache: "no-store" })
	const entries: { list: List; created: number }[] = await res.json()
	return entries.map((e) => ({
		list: e.list,
		name: e.list.name,
		main_faction: e.list.faction,
		game_size: e.list.points,
		formations: e.list.formations.length,
		created: e.created as unknown as DB_ENTRY["created"],
	}))
}

export const fetchList = async (id: string): Promise<List | null> => {
	const res = await fetch(`/api/lists/${id}`, { cache: "no-store" })
	if (!res.ok) return null
	return res.json()
}

export const saveListToServer = async (list: List) => {
	const res = await fetch("/api/lists", { method: "POST", body: JSON.stringify(list) })
	return res.json() as Promise<{ uploaded: boolean; message: string }>
}

export const deleteListFromServer = async (id: string) => {
	await fetch(`/api/lists/${id}`, { method: "DELETE" })
}

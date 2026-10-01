import { List } from "@type/listTypes"
import { getDb } from "./db"

// Lists live in SQLite, each owned by the account that saved it.
const parse = (row: Record<string, any>): List => ({ ...JSON.parse(row.json), user: row.owner })

export const listsFor = (owner: string) =>
	getDb()
		.prepare("SELECT owner, json, created FROM lists WHERE owner = ? ORDER BY updated DESC")
		.all(owner)
		.map((row) => ({ list: parse(row), created: row.created as number }))

export const getOne = (id: string): List | null => {
	const row = getDb().prepare("SELECT owner, json FROM lists WHERE id = ?").get(id)
	return row ? parse(row) : null
}

// Create or update; only the owner may overwrite an existing list.
export const saveOne = (list: List, owner: string) => {
	const db = getDb()
	const existing = db.prepare("SELECT owner FROM lists WHERE id = ?").get(list.id)
	if (existing && existing.owner !== owner) return { uploaded: false, message: "You can only edit your own lists" }
	const json = JSON.stringify({ ...list, user: owner })
	const now = Date.now()
	if (existing) db.prepare("UPDATE lists SET json = ?, updated = ? WHERE id = ?").run(json, now, list.id)
	else db.prepare("INSERT INTO lists (id, owner, json, created, updated) VALUES (?, ?, ?, ?, ?)").run(list.id, owner, json, now, now)
	return { uploaded: true, message: "List saved" }
}

// Returns false if the list doesn't exist or belongs to someone else.
export const deleteOne = (id: string, owner: string) =>
	getDb().prepare("DELETE FROM lists WHERE id = ? AND owner = ?").run(id, owner).changes > 0

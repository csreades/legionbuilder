import path from "path"
import { existsSync, readFileSync } from "fs"
import seedLists from "@data/seedLists.json"

// SQLite store (Node's built-in node:sqlite — no extra dependency). Loaded via
// getBuiltinModule so the bundler never tries to resolve it.
const DB_FILE = path.join(process.cwd(), ".local", "legionbuilder.db")
const LEGACY_JSON = path.join(process.cwd(), ".local", "lists.json")
// Pre-accounts lists (and the bundled defaults) are assigned to this user.
export const LEGACY_OWNER = (process.env.LEGACY_OWNER || "craig").toLowerCase()

type Row = Record<string, any>
export interface DB {
	exec(sql: string): void
	prepare(sql: string): { run(...a: any[]): any; get(...a: any[]): Row | undefined; all(...a: any[]): Row[] }
}

let db: DB | null = null

export const getDb = (): DB => {
	if (db) return db
	const { mkdirSync } = require("fs")
	mkdirSync(path.dirname(DB_FILE), { recursive: true })
	const { DatabaseSync } = (process as any).getBuiltinModule("node:sqlite")
	const conn: DB = new DatabaseSync(DB_FILE)
	conn.exec(`
		PRAGMA journal_mode = WAL;
		CREATE TABLE IF NOT EXISTS users (
			username TEXT PRIMARY KEY,
			password_hash TEXT NOT NULL,
			salt TEXT NOT NULL,
			created INTEGER NOT NULL
		);
		CREATE TABLE IF NOT EXISTS sessions (
			token TEXT PRIMARY KEY,
			username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
			created INTEGER NOT NULL
		);
		CREATE TABLE IF NOT EXISTS lists (
			id TEXT PRIMARY KEY,
			owner TEXT NOT NULL,
			json TEXT NOT NULL,
			created INTEGER NOT NULL,
			updated INTEGER NOT NULL
		);
		CREATE INDEX IF NOT EXISTS lists_owner ON lists(owner);
	`)
	migrate(conn)
	db = conn
	return conn
}

// One-time import: the old JSON store if present, otherwise the bundled defaults.
const migrate = (conn: DB) => {
	if ((conn.prepare("SELECT COUNT(*) AS n FROM lists").get() as Row).n > 0) return
	let entries: { list: any; created: number }[] = []
	if (existsSync(LEGACY_JSON)) {
		try {
			entries = Object.values(JSON.parse(readFileSync(LEGACY_JSON, "utf8")))
		} catch {}
	}
	if (!entries.length) entries = (seedLists as any[]).map((list) => ({ list, created: Date.now() }))
	const insert = conn.prepare("INSERT OR IGNORE INTO lists (id, owner, json, created, updated) VALUES (?, ?, ?, ?, ?)")
	for (const { list, created } of entries) {
		const owned = { ...list, user: LEGACY_OWNER }
		insert.run(list.id, LEGACY_OWNER, JSON.stringify(owned), created || Date.now(), Date.now())
	}
}

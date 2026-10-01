#!/usr/bin/env node
// Nightly backup of the Legion Builder SQLite database.
// Uses `VACUUM INTO`, which writes a consistent snapshot (including changes still in
// the WAL file) while the app keeps running. Keeps the newest KEEP_DAYS copies.
const path = require("path")
const fs = require("fs")
const { DatabaseSync } = require("node:sqlite")

const SOURCE = process.env.LB_DB || path.join(__dirname, "..", ".local", "legionbuilder.db")
const DEST_DIR = process.env.LB_BACKUP_DIR || "/var/backups/legionbuilder"
const KEEP_DAYS = Number(process.env.LB_BACKUP_KEEP || 14)

fs.mkdirSync(DEST_DIR, { recursive: true, mode: 0o700 })
fs.chmodSync(DEST_DIR, 0o700) // backups hold password hashes + session tokens: root only
const stamp = new Date().toISOString().slice(0, 10) // one backup per day
const target = path.join(DEST_DIR, `legionbuilder-${stamp}.db`)
if (fs.existsSync(target)) fs.rmSync(target) // re-running today replaces today's copy

const src = new DatabaseSync(SOURCE, { readOnly: true })
src.exec(`VACUUM INTO '${target.replace(/'/g, "''")}'`)
src.close()
fs.chmodSync(target, 0o600)

// Sanity-check the copy before trusting it.
const check = new DatabaseSync(target, { readOnly: true })
const ok = check.prepare("PRAGMA integrity_check").get().integrity_check
const lists = check.prepare("SELECT COUNT(*) AS n FROM lists").get().n
const users = check.prepare("SELECT COUNT(*) AS n FROM users").get().n
check.close()
if (ok !== "ok") {
	console.error(`backup ${target} failed integrity check: ${ok}`)
	process.exit(1)
}

// Retention: drop the oldest beyond KEEP_DAYS.
const backups = fs
	.readdirSync(DEST_DIR)
	.filter((f) => /^legionbuilder-\d{4}-\d{2}-\d{2}\.db$/.test(f))
	.sort()
for (const old of backups.slice(0, Math.max(0, backups.length - KEEP_DAYS))) fs.rmSync(path.join(DEST_DIR, old))

console.log(`backup ok: ${target} (${lists} lists, ${users} users; keeping ${Math.min(backups.length, KEEP_DAYS)})`)

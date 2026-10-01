import { NextRequest, NextResponse } from "next/server"
import { getDb } from "../../_lib/db"
import { createSession, hashPassword, normaliseUsername, setSessionCookie, validPassword, validUsername } from "../../_lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	const username = normaliseUsername(body.username)
	if (!validUsername(username))
		return NextResponse.json({ error: "Username must be 3–24 letters, numbers, - or _" }, { status: 400 })
	if (!validPassword(body.password))
		return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
	const db = getDb()
	if (db.prepare("SELECT 1 FROM users WHERE username = ?").get(username))
		return NextResponse.json({ error: "That username is taken" }, { status: 409 })
	const { salt, hash } = hashPassword(body.password)
	db.prepare("INSERT INTO users (username, password_hash, salt, created) VALUES (?, ?, ?, ?)").run(username, hash, salt, Date.now())
	const res = NextResponse.json({ username })
	setSessionCookie(req, res, createSession(username))
	return res
}

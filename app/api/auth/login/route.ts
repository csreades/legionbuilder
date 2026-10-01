import { NextRequest, NextResponse } from "next/server"
import { getDb } from "../../_lib/db"
import { checkPassword, createSession, normaliseUsername, setSessionCookie } from "../../_lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	const username = normaliseUsername(body.username)
	const user = getDb().prepare("SELECT password_hash, salt FROM users WHERE username = ?").get(username)
	if (!user || typeof body.password !== "string" || !checkPassword(body.password, user.salt, user.password_hash))
		return NextResponse.json({ error: "Wrong username or password" }, { status: 401 })
	const res = NextResponse.json({ username })
	setSessionCookie(req, res, createSession(username))
	return res
}

import { NextRequest, NextResponse } from "next/server"
import { getDb } from "../../_lib/db"
import { SESSION_COOKIE } from "../../_lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
	const token = req.cookies.get(SESSION_COOKIE)?.value
	if (token) getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token)
	const res = NextResponse.json({ ok: true })
	res.cookies.delete(SESSION_COOKIE)
	return res
}

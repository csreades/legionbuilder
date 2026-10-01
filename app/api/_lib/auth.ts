import { randomBytes, scryptSync, timingSafeEqual } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "./db"

export const SESSION_COOKIE = "lb_session"
const SESSION_DAYS = 180

export const normaliseUsername = (name: unknown) =>
	typeof name === "string" ? name.trim().toLowerCase() : ""
export const validUsername = (name: string) => /^[a-z0-9_-]{3,24}$/.test(name)
export const validPassword = (pw: unknown): pw is string => typeof pw === "string" && pw.length >= 6

export const hashPassword = (password: string, salt = randomBytes(16).toString("hex")) => ({
	salt,
	hash: scryptSync(password, salt, 64).toString("hex"),
})

export const checkPassword = (password: string, salt: string, hash: string) => {
	const candidate = Buffer.from(hashPassword(password, salt).hash, "hex")
	const stored = Buffer.from(hash, "hex")
	return candidate.length === stored.length && timingSafeEqual(candidate, stored)
}

export const createSession = (username: string) => {
	const token = randomBytes(32).toString("hex")
	getDb().prepare("INSERT INTO sessions (token, username, created) VALUES (?, ?, ?)").run(token, username, Date.now())
	return token
}

// Username for the request's session cookie, or null if not signed in.
export const sessionUser = (req: NextRequest): string | null => {
	const token = req.cookies.get(SESSION_COOKIE)?.value
	if (!token) return null
	const row = getDb().prepare("SELECT username FROM sessions WHERE token = ?").get(token)
	return row ? (row.username as string) : null
}

export const setSessionCookie = (req: NextRequest, res: NextResponse, token: string) => {
	res.cookies.set(SESSION_COOKIE, token, {
		httpOnly: true,
		sameSite: "lax",
		// Secure only when the browser reached us over HTTPS (e.g. via Cloudflare) so
		// plain-HTTP LAN access still works.
		secure: req.headers.get("x-forwarded-proto") === "https" || req.nextUrl.protocol === "https:",
		path: "/",
		maxAge: SESSION_DAYS * 24 * 60 * 60,
	})
}

export const unauthorised = () => NextResponse.json({ error: "Not signed in" }, { status: 401 })

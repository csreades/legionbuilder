import { NextRequest, NextResponse } from "next/server"
import { listsFor, saveOne } from "../_lib/listStore"
import { sessionUser, unauthorised } from "../_lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Only the signed-in user's own lists.
export async function GET(req: NextRequest) {
	const user = sessionUser(req)
	if (!user) return unauthorised()
	return NextResponse.json(listsFor(user))
}

export async function POST(req: NextRequest) {
	const user = sessionUser(req)
	if (!user) return unauthorised()
	const result = saveOne(await req.json(), user)
	return NextResponse.json(result, { status: result.uploaded ? 200 : 403 })
}

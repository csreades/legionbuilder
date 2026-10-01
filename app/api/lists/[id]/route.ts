import { NextRequest, NextResponse } from "next/server"
import { getOne, deleteOne } from "../../_lib/listStore"
import { sessionUser, unauthorised } from "../../_lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Any signed-in user can open a list by id (so share links keep working); the
// lists page only ever shows your own.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	if (!sessionUser(req)) return unauthorised()
	return NextResponse.json(getOne(params.id))
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	const user = sessionUser(req)
	if (!user) return unauthorised()
	const ok = deleteOne(params.id, user)
	return NextResponse.json({ ok }, { status: ok ? 200 : 403 })
}

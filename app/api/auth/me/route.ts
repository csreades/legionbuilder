import { NextRequest, NextResponse } from "next/server"
import { sessionUser } from "../../_lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
	return NextResponse.json({ username: sessionUser(req) })
}

import { NextRequest, NextResponse } from "next/server"
import { listAll, saveOne } from "../_lib/listStore"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// All shared lists (anyone landing on the page sees these).
export async function GET() {
	const entries = await listAll()
	return NextResponse.json(entries.map((e) => ({ list: e.list, created: e.created })))
}

export async function POST(req: NextRequest) {
	const list = await req.json()
	return NextResponse.json(await saveOne(list))
}

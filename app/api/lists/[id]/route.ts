import { NextRequest, NextResponse } from "next/server"
import { getOne, deleteOne } from "../../_lib/listStore"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
	return NextResponse.json(await getOne(params.id))
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
	const ok = await deleteOne(params.id)
	return NextResponse.json({ ok })
}

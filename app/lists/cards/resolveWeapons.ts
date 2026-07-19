import { detachmentData } from "@data/detachment_data"
import { unitData } from "@data/unit_data"
import { List, ListDetachment } from "@type/listTypes"
import mapData from "@data/loadoutWeaponMap.generated.json"

// The generated loadout -> weapon-id map. `[]` means "pending review" (fail-open),
// `null` means an intentional "None"/no-weapon opt-out.
const weaponMap = mapData.weaponMap as Record<string, Record<string, Record<string, number[] | null>>>
const unitSelectMap = mapData.unitSelectMap as Record<string, Record<string, Record<string, number | null>>>

const detachmentUnitIds = (detId: number): number[] => {
	const d = detachmentData.find((x) => x.id === detId)
	return d ? [...(d.main_unit || []), ...(d.related_unit || [])] : []
}

export const allUnitWeaponIds = (detId: number): number[] => {
	const ids = detachmentUnitIds(detId).flatMap((id) => unitData.find((u) => u.id === id)?.weapons || [])
	return Array.from(new Set(ids))
}

// weapon ids tied to a loadout option, grouped by location (these are hideable)
const optionWeaponIdsByLocation = (detId: number): Record<string, number[]> => {
	const locs = weaponMap[detId] || {}
	const out: Record<string, number[]> = {}
	for (const loc in locs) {
		const ids: number[] = []
		for (const opt in locs[loc]) {
			const v = locs[loc][opt]
			if (Array.isArray(v)) ids.push(...v)
		}
		out[loc] = Array.from(new Set(ids))
	}
	return out
}

// Weapon ids to show on a detachment's card: fixed weapons always, plus the
// weapons for selected loadout options. Unselected options are hidden. Locations
// that are unresolved (no selection, unmapped name, or a pending `[]` mapping)
// fail open — their option weapons stay visible so nothing is wrongly hidden.
export const visibleWeaponIds = (list: List, detachment: ListDetachment): number[] => {
	const detId = detachment.id
	const all = allUnitWeaponIds(detId)
	const byLoc = optionWeaponIdsByLocation(detId)
	const allOptionIds = new Set(Object.values(byLoc).flat())
	const shown = new Set<number>()

	for (const id of all) if (!allOptionIds.has(id)) shown.add(id) // fixed weapons

	const slotLoadouts = list.loadouts.filter((s) => s.slot_id === detachment.slot_id).flatMap((s) => s.loadouts)
	const selectedByLoc: Record<string, string[]> = {}
	for (const ld of slotLoadouts) for (const w of ld.weapons) (selectedByLoc[w.location] ||= []).push(w.weapon)

	const locMap = weaponMap[detId] || {}
	for (const loc in byLoc) {
		const selectedNames = selectedByLoc[loc] || []
		if (!selectedNames.length) {
			byLoc[loc].forEach((id) => shown.add(id)) // unresolved -> fail open
			continue
		}
		let failOpen = false
		const ids: number[] = []
		for (const name of selectedNames) {
			const v = locMap[loc]?.[name]
			if (Array.isArray(v)) {
				if (v.length === 0) failOpen = true // pending
				else ids.push(...v)
			} else if (v === undefined) {
				failOpen = true // unmapped selection name
			}
			// v === null is an explicit "None" -> contributes nothing
		}
		if (failOpen) byLoc[loc].forEach((id) => shown.add(id))
		else ids.forEach((id) => shown.add(id))
	}

	return all.filter((id) => shown.has(id)) // preserve datasheet order
}

// Additional (related) units are only shown if actually taken — i.e. a selected
// upgrade for this detachment references that unit id.
export const takenRelatedUnitIds = (list: List, detachment: ListDetachment): number[] => {
	const data = detachmentData.find((d) => d.id === detachment.id)
	if (!data || !data.related_unit.length) return []
	const refs = new Set(
		list.upgrades
			.filter((u) => u.slot_id === detachment.slot_id)
			.flatMap((u) => u.upgrades)
			.map((u) => u.unit_ref)
	)
	return data.related_unit.filter((id) => refs.has(id))
}

// A card's identity: same detachment + same weapon choices + variant notes + taken
// related units. Detachment size / model count is deliberately excluded so size-only
// differences collapse into one card.
export const cardSignature = (list: List, detachment: ListDetachment): string => {
	const ids = visibleWeaponIds(list, detachment)
		.slice()
		.sort((a, b) => a - b)
		.join(",")
	const notes = variantNotes(list, detachment).join("|")
	const related = takenRelatedUnitIds(list, detachment)
		.slice()
		.sort((a, b) => a - b)
		.join(",")
	return `${detachment.id}:${ids}:${notes}:${related}`
}

// Variant/specialist selections (Chassis/specialist locations) shown as notes.
export const variantNotes = (list: List, detachment: ListDetachment): string[] => {
	const sel = unitSelectMap[detachment.id]
	if (!sel) return []
	const slotLoadouts = list.loadouts.filter((s) => s.slot_id === detachment.slot_id).flatMap((s) => s.loadouts)
	const notes: string[] = []
	for (const ld of slotLoadouts)
		for (const w of ld.weapons) if (sel[w.location]) notes.push(`${w.location}: ${w.weapon}`)
	return Array.from(new Set(notes))
}

import { writeFileSync } from "fs"
import { join } from "path"
import { detachmentData } from "./detachment_data"
import { unitData } from "./unit_data"
import { weapons } from "./weapon_data"

// Generator (run via jest) seeding an explicit loadout-option -> weapon-id(s) map
// by keyword-matching each free loadout option to the detachment's unit weapons.
// Handles combo options (multiple weapons), typos (edit distance), and separates
// unit-variant selectors (Chassis/specialist) from weapon choices. Low-confidence
// matches are reported for manual review.

const normalize = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, " ")
		.trim()

const lev = (a: string, b: string): number => {
	const m = a.length,
		n = b.length
	const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
	for (let j = 0; j <= n; j++) d[0][j] = j
	for (let i = 1; i <= m; i++)
		for (let j = 1; j <= n; j++)
			d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
	return d[m][n]
}

// Manual overrides for matches the heuristic can't get right; take precedence and
// survive regeneration. Reviewed decisions land here.
// An empty array [] is the "pending review" sentinel: the consuming code treats it
// as fail-open (show the weapons for that location, hide nothing) until resolved.
const OVERRIDES: Record<number, Record<string, Record<string, number[]>>> = {
	4004: { "Arm 1": { "Reaver chainfist": [4049] }, "Arm 2": { "Reaver chainfist": [4049] } }, // Reaver chain fist
	2013: { "Wing 1": { "Skyfire missiles": [] }, "Wing 2": { "Skyfire missiles": [] } }, // PENDING: Skystrike vs Hellstrike — user to confirm
}

const STOP = new Set(["mounted", "twin", "linked", "and", "or", "the", "with", "pair", "upgrade", "class", "pattern"])
const tokens = (s: string) =>
	normalize(s)
		.split(" ")
		.filter(Boolean)
		.map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w))
		.filter((w) => !STOP.has(w))

// fuzzy token equality: exact, or edit distance <=1 for longer words (typos)
const tokEq = (a: string, b: string) => a === b || (Math.min(a.length, b.length) >= 4 && lev(a, b) <= 1)

// Physical mount markers that appear in weapon names AND loadout locations. Used to
// keep e.g. a "Hull" option matching "Hull Mounted lascannon" rather than the
// same-noun "…sponsons" weapon that merely shares the unit's name prefix.
const LOC_MARKERS = [
	"hull",
	"sponson",
	"pintle",
	"turret",
	"coaxial",
	"nose",
	"wing",
	"carapace",
	"arm",
	"shoulder",
	"back",
	"belly",
	"chest",
]
const candLocation = (toks: string[]) => LOC_MARKERS.find((m) => toks.includes(m)) || null

const scoreWeapon = (optToks: string[], locToks: string[], prefix: string, cand: any) => {
	const nounToks = optToks.filter((t) => !LOC_MARKERS.includes(t))
	const matched = nounToks.filter((t) => cand.toks.some((c: string) => tokEq(t, c))).length
	// A weapon whose noun doesn't match is never a candidate — location/prefix only
	// break ties among genuine noun matches (else a "Hull" marker alone could win).
	if (matched === 0) return { score: 0, matched: 0, full: false }
	const wantLoc = locToks.find((t) => LOC_MARKERS.includes(t)) || null
	const cLoc = candLocation(cand.toks)
	const locScore = wantLoc && cLoc ? (wantLoc === cLoc ? 6 : -6) : 0
	const prefixBonus = prefix && cand.toks.includes(prefix) ? 1 : 0
	return {
		score: matched * 3 + locScore + prefixBonus,
		matched,
		full: nounToks.length > 0 && matched === nounToks.length,
	}
}

const bestWeapon = (namePart: string, locToks: string[], prefix: string, candidates: any[]) => {
	const optToks = tokens(namePart)
	if (!optToks.length) return null
	let best: any = null
	for (const c of candidates) {
		const s = scoreWeapon(optToks, locToks, prefix, c)
		if (!best || s.score > best.score) best = { ...s, cand: c }
	}
	return best && best.score > 0 ? best : null
}

test("generate loadout->weapon map", () => {
	const weaponById = new Map(weapons.map((w) => [w.id, w]))
	const unitById = new Map(unitData.map((u) => [u.id, u]))

	const weaponMap: Record<number, Record<string, Record<string, number[] | null>>> = {}
	const unitSelectMap: Record<number, Record<string, Record<string, number | null>>> = {}
	const review: any[] = []
	let total = 0,
		high = 0,
		low = 0,
		none = 0,
		noneOpt = 0,
		unitSel = 0

	for (const det of detachmentData) {
		if (!det.loadout_options?.length) continue

		const prefix = tokens(det.name)[0] || ""
		const unitIds = [...(det.main_unit || []), ...(det.related_unit || [])]
		const candidates = Array.from(new Set(unitIds.flatMap((id) => unitById.get(id)?.weapons || [])))
			.map((id) => weaponById.get(id))
			.filter(Boolean)
			.map((w: any) => ({ id: w.id, name: w.name, toks: tokens(w.name) }))

		for (const loadout of det.loadout_options) {
			const isUnitSelect = /chassis|specialist/i.test(loadout.location)
			const locToks = tokens(loadout.location)

			for (const option of loadout.options) {
				weaponMap[det.id] = weaponMap[det.id] || {}
				weaponMap[det.id][loadout.location] = weaponMap[det.id][loadout.location] || {}

				if (/^none$/i.test(option.name)) {
					weaponMap[det.id][loadout.location][option.name] = null
					noneOpt++
					continue
				}

				// Unit-variant selector (e.g. "Chassis: Knight Errant") -> match a unit datasheet
				if (isUnitSelect) {
					const optToks = tokens(option.name)
					let bestUnit: any = null
					for (const u of unitData) {
						const ut = tokens(u.name)
						const matched = optToks.filter((t) => ut.some((x) => tokEq(t, x))).length
						if (matched && (!bestUnit || matched > bestUnit.matched)) bestUnit = { u, matched, full: matched === optToks.length }
					}
					unitSelectMap[det.id] = unitSelectMap[det.id] || {}
					unitSelectMap[det.id][loadout.location] = unitSelectMap[det.id][loadout.location] || {}
					unitSelectMap[det.id][loadout.location][option.name] = bestUnit ? bestUnit.u.id : null
					unitSel++
					if (!bestUnit || !bestUnit.full)
						review.push({
							kind: "unit-select",
							detId: det.id,
							detachment: det.name,
							location: loadout.location,
							option: option.name,
							chosen: bestUnit ? `${bestUnit.u.name} (#${bestUnit.u.id})` : null,
						})
					continue
				}

				total++
				// Combo option -> split into parts, match each to a weapon
				const parts = option.name.split(/\s+and\s+|\s*&\s*|\s*\/\s*/i).filter(Boolean)
				const ids: number[] = []
				let allFull = true
				const partReports: string[] = []
				for (const part of parts) {
					const b = bestWeapon(part, locToks, prefix, candidates)
					if (b) {
						if (!ids.includes(b.cand.id)) ids.push(b.cand.id)
						if (!b.full) allFull = false
						partReports.push(`${part.trim()}→${b.cand.name}(#${b.cand.id})${b.full ? "" : "?"}`)
					} else {
						allFull = false
						partReports.push(`${part.trim()}→? `)
					}
				}

				weaponMap[det.id][loadout.location][option.name] = ids.length ? ids : null
				const confidence = ids.length === 0 ? "none" : allFull && ids.length === parts.length ? "high" : "low"
				if (confidence === "high") high++
				else {
					confidence === "none" ? none++ : low++
					review.push({
						kind: "weapon",
						detId: det.id,
						detachment: det.name,
						location: loadout.location,
						option: option.name,
						confidence,
						mapped: partReports.join(" | "),
						candidates: candidates.map((c) => `${c.name} (#${c.id})`),
					})
				}
			}
		}
	}

	// Apply manual overrides
	for (const detId in OVERRIDES)
		for (const loc in OVERRIDES[detId])
			for (const opt in OVERRIDES[detId][loc]) {
				weaponMap[detId] = weaponMap[detId] || {}
				weaponMap[detId][loc] = weaponMap[detId][loc] || {}
				weaponMap[detId][loc][opt] = OVERRIDES[detId][loc][opt]
			}

	const outDir = "/tmp/claude-0/-root-repos-legionbuilder/b3799267-6924-4e76-853c-c33080c54acc/scratchpad"
	writeFileSync(
		join(process.cwd(), "app/data/loadoutWeaponMap.generated.json"),
		JSON.stringify({ weaponMap, unitSelectMap }, null, 2)
	)
	try {
		writeFileSync(
			join(outDir, "loadout-review.json"),
			JSON.stringify({ summary: { total, high, low, none, noneOpt, unitSel }, review }, null, 2)
		)
	} catch {
		/* review dump is dev-only; ignore if the scratchpad path is absent */
	}
	// eslint-disable-next-line no-console
	console.log(`LOADOUT MAP: weapons total=${total} high=${high} low=${low} none=${none} | none-opts=${noneOpt} unit-select=${unitSel} review=${review.length}`)
	expect(high + low + none).toBe(total)
})

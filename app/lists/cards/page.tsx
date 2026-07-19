"use client"

import { listState } from "@lists/state"
import { BreadCrumbs, Crumb } from "@components/BreadCrumbs"
import DetachmentDataslate from "@components/DetachmentDataslate"
import Formation from "@lists/view/components/Formation"
import { detachmentData } from "@data/detachment_data"
import { unitData } from "@data/unit_data"
import { totalListPoints } from "@lists/builder/utils"
import { visibleWeaponIds, variantNotes, cardSignature, takenRelatedUnitIds } from "./resolveWeapons"

const page = () => {
	const { list } = listState()

	if (!list || !list.formations.length) {
		return <h2 className="text-primary-50 p-4">No list found</h2>
	}

	const formations = list.formations.filter((formation) => formation.name)

	// Every taken detachment instance that resolves to a unit datasheet.
	const instances = formations.flatMap((formation) =>
		formation.detachment_groups.flatMap((group) =>
			group.detachment_slots
				.map((slot) => list.detachments.find((det) => det.slot_id === slot.id && det.id))
				.filter((det): det is NonNullable<typeof det> => Boolean(det))
				.map((det) => {
					const data = detachmentData.find((entry) => entry.id === det.id)
					const hasUnit = data?.main_unit.some((id) => unitData.some((unit) => unit.id === id))
					if (!data || !hasUnit) return null
					return { slotId: det.slot_id, det, data, sig: cardSignature(list, det) }
				})
				.filter((inst): inst is NonNullable<typeof inst> => Boolean(inst))
		)
	)

	// Distinct signatures per detachment id -> assign [A]/[B]… only when a detachment
	// appears with more than one distinct set of weapon choices.
	const sigOrderByDet: Record<number, string[]> = {}
	instances.forEach((inst) => {
		const arr = (sigOrderByDet[inst.det.id] ||= [])
		if (!arr.includes(inst.sig)) arr.push(inst.sig)
	})
	const labelBySig: Record<string, string> = {}
	Object.values(sigOrderByDet).forEach((sigs) => {
		if (sigs.length > 1) sigs.forEach((sig, index) => (labelBySig[sig] = String.fromCharCode(65 + index)))
		else labelBySig[sigs[0]] = ""
	})
	const labelBySlot: Record<string, string> = {}
	instances.forEach((inst) => (labelBySlot[inst.slotId] = labelBySig[inst.sig]))

	// One card per distinct signature; order by points cost (desc) then name (A–Z).
	const seen = new Set<string>()
	const cards = instances
		.filter((inst) => !seen.has(inst.sig) && seen.add(inst.sig))
		.sort((a, b) => b.data.base_cost - a.data.base_cost || a.data.name.localeCompare(b.data.name))

	return (
		<div className="w-full flex flex-col gap-4 text-primary-50">
			<BreadCrumbs>
				<Crumb href="/lists">Lists</Crumb>
				<Crumb href="/lists/cards">Cards</Crumb>
			</BreadCrumbs>

			<div>
				<h2 className="text-lg font-bold">
					<span className="font-subrayada text-xl">{list.name}</span>
					{` ${totalListPoints(list).totalPoints} / ${list.points}pts`}
				</h2>
				<h3 className="font-graduate">
					{list.allegiance} {list.faction}
				</h3>
			</div>

			{/* Flagged list tree (selected loadouts per detachment, with [A]/[B] labels) */}
			<section>
				{formations.map((formation) => (
					<Formation key={formation.id} list={list} formation={formation} labels={labelBySlot} />
				))}
			</section>

			{/* Unique reference cards, weapons filtered to selections, ordered by points */}
			<section className="flex flex-col gap-4">
				{cards.map((inst) => (
					<DetachmentDataslate
						key={inst.sig}
						detachment={inst.data}
						visibleWeaponIds={visibleWeaponIds(list, inst.det)}
						notes={variantNotes(list, inst.det)}
						label={labelBySig[inst.sig]}
						visibleRelatedUnitIds={takenRelatedUnitIds(list, inst.det)}
						hideLoadoutText
						hideUpgrades
					/>
				))}
			</section>
		</div>
	)
}

export default page

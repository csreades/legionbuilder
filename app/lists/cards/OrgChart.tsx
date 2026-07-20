"use client"

import { List, ListDetachment, ListFormation } from "@type/listTypes"
import { formationData } from "@data/formation_data"
import {
	findDetachmentSlot,
	findFormationDetachmentBreakSlotIds,
	findLoadoutBySlotId,
	findUpgradeBySlotId,
	totalFormationPoints,
} from "@lists/builder/utils"
import { currentDetachmentSize, totalDetachmentPoints } from "@lists/builder/components/detachment/utils"
import { sum } from "@app/utils/math"

const breakInfo = (list: List, formation: ListFormation) => {
	const ids = findFormationDetachmentBreakSlotIds(formation)
	const det = sum(
		list.detachments
			.filter((d) => ids.includes(d.slot_id))
			.map((d) => (d.break_strength === 0 ? 0 : d.break_strength ? d.size * d.break_strength : d.size))
	)
	const up = sum(
		list.upgrades
			.filter((u) => ids.includes(u.slot_id))
			.flatMap((u) => u.upgrades.map((e) => (e.break_strength === 0 ? 0 : e.break_strength ? e.break_strength * e.size : e.size)))
	)
	const strength = det + up
	return { strength, breakPoint: Math.ceil(strength / 2) }
}

// One detachment slot, rendered as a labelled box like a force-org symbol.
const DetachmentBox = ({ list, detachment, label }: { list: List; detachment: ListDetachment; label?: string }) => {
	const role = detachment.slot_type || findDetachmentSlot(list, detachment).type
	const loadouts = findLoadoutBySlotId(list, detachment.slot_id)?.loadouts || []
	const upgrades = findUpgradeBySlotId(list, detachment.slot_id)?.upgrades || []

	return (
		<div className="w-44 bg-backgrounds-900 border border-primary-700 rounded-md overflow-hidden shadow">
			<div className="bg-primary-950 text-primary-100 text-[10px] uppercase tracking-widest font-graduate px-2 py-1 text-center border-b border-primary-700">
				{role}
			</div>
			<div className="px-2 py-1">
				<div className="font-graduate text-primary-300 text-xs leading-tight">
					{detachment.name}
					{label ? ` [${label}]` : ""}
				</div>
				<div className="text-[10px] text-secondary-300">
					{currentDetachmentSize(list, detachment.slot_id)} · {totalDetachmentPoints(list, detachment.slot_id)}pts
				</div>
				{upgrades.map((u, i) => (
					<div key={`u${i}`} className="text-[10px] text-secondary-400 truncate">
						+ {u.number} {u.name}
					</div>
				))}
				{loadouts.map((ld, i) => (
					<div key={`l${i}`} className="text-[10px] text-tertiary-400 truncate">
						{ld.weapons.map((w) => `${w.location}: ${w.weapon}`).join(" · ")}
					</div>
				))}
			</div>
		</div>
	)
}

const bandTitle = (type: string) =>
	/choice/i.test(type) ? "One of the following" : `${type} Detachments`

const OrgChart = ({ list, labels }: { list: List; labels?: Record<string, string> }) => {
	const formations = list.formations.filter((f) => f.name)

	return (
		<div className="w-full flex flex-col gap-6">
			{formations.map((formation) => {
				const { strength, breakPoint } = breakInfo(list, formation)
				const data = formationData.find((f) => f.id === formation.data_id)
				const groups = formation.detachment_groups
					.map((group) => ({
						group,
						detachments: group.detachment_slots
							.map((slot) => list.detachments.find((d) => d.slot_id === slot.id && d.id))
							.filter((d): d is ListDetachment => Boolean(d)),
					}))
					.filter((g) => g.detachments.length)

				return (
					<div key={formation.id} className="border-2 border-primary-600 rounded-lg bg-secondary-900/60 overflow-hidden">
						{/* Formation header */}
						<div className="bg-primary-950 text-center py-2 px-3 border-b-2 border-primary-600">
							<div className="text-[11px] uppercase tracking-widest text-secondary-300 font-graduate">
								{list.allegiance} {list.faction} Formation
							</div>
							<div className="font-graduate text-lg text-primary-50 uppercase tracking-wide">
								{formation.nickname ? `${formation.nickname} — ` : ""}
								{formation.name}
							</div>
							<div className="text-xs text-secondary-300 font-graduate">
								{totalFormationPoints(list, formation)}pts · Strength {strength} · Break {breakPoint}
							</div>
						</div>

						{/* Category bands, stacked like the rulebook */}
						<div className="flex flex-col gap-3 p-3">
							{groups.map(({ group, detachments }, gi) => (
								<div key={gi} className="border border-primary-800 rounded-md">
									<div className="text-center font-graduate uppercase tracking-widest text-sm text-primary-200 bg-primary-900/50 py-1 border-b border-primary-800">
										{bandTitle(group.type)}
									</div>
									<div className="flex flex-wrap gap-3 justify-center p-3">
										{detachments.map((det) => (
											<DetachmentBox
												key={det.slot_id}
												list={list}
												detachment={det}
												label={labels?.[det.slot_id]}
											/>
										))}
									</div>
								</div>
							))}
						</div>

						{data?.rules.length ? (
							<div className="px-3 pb-3 text-[11px] text-secondary-300 italic">
								{data.rules.map((r) => (r.name ? `${r.name}: ${r.text}` : r.text)).join("  ")}
							</div>
						) : null}
					</div>
				)
			})}
		</div>
	)
}

export default OrgChart

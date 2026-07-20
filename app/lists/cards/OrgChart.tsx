"use client"

import { List, ListDetachment, ListFormation } from "@type/listTypes"
import {
	findDetachmentSlot,
	findFormationDetachmentBreakSlotIds,
	findLoadoutBySlotId,
	findUpgradeBySlotId,
	totalFormationPoints,
} from "@lists/builder/utils"
import { currentDetachmentSize, totalDetachmentPoints } from "@lists/builder/components/detachment/utils"
import { sum } from "@app/utils/math"

const LINE = "bg-primary-500"

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

const DetachmentNode = ({ list, detachment, label }: { list: List; detachment: ListDetachment; label?: string }) => {
	const role = detachment.slot_type || findDetachmentSlot(list, detachment).type
	const loadouts = findLoadoutBySlotId(list, detachment.slot_id)?.loadouts || []
	const upgrades = findUpgradeBySlotId(list, detachment.slot_id)?.upgrades || []

	return (
		<div className="relative w-52 max-w-full bg-backgrounds-900 border border-primary-700 rounded-md shadow-md">
			<div className="bg-primary-950 text-primary-50 text-[10px] uppercase tracking-widest font-graduate px-2 py-0.5 border-b border-primary-700">
				{role}
			</div>
			<div className="px-2 py-1">
				<div className="font-graduate text-primary-300 text-sm leading-tight">
					{detachment.name}
					{label ? ` [${label}]` : ""}
				</div>
				<div className="text-[11px] text-secondary-300">
					{currentDetachmentSize(list, detachment.slot_id)} models · {totalDetachmentPoints(list, detachment.slot_id)}pts
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

const OrgChart = ({ list, labels }: { list: List; labels?: Record<string, string> }) => {
	const formations = list.formations.filter((f) => f.name)

	return (
		<div className="w-full flex flex-col gap-10 overflow-x-auto pb-2">
			{formations.map((formation) => {
				const { strength, breakPoint } = breakInfo(list, formation)
				const groups = formation.detachment_groups
					.map((group) => ({
						group,
						detachments: group.detachment_slots
							.map((slot) => list.detachments.find((d) => d.slot_id === slot.id && d.id))
							.filter((d): d is ListDetachment => Boolean(d)),
					}))
					.filter((g) => g.detachments.length)

				return (
					<div key={formation.id} className="flex flex-col items-center min-w-max mx-auto">
						{/* Formation node */}
						<div className="bg-primary-950 border-2 border-primary-500 rounded-lg px-4 py-2 text-center shadow-lg">
							<div className="font-graduate text-primary-50 uppercase tracking-wide">
								{formation.nickname ? `${formation.nickname} — ` : ""}
								{formation.name}
							</div>
							<div className="text-xs text-secondary-300 font-graduate">
								{totalFormationPoints(list, formation)}pts · Strength {strength} · Break {breakPoint}
							</div>
						</div>

						{/* trunk */}
						<div className={`w-0.5 h-5 ${LINE}`} />

						{/* branch bus + role groups */}
						<div className={`flex items-start gap-8 border-t-2 border-primary-500 pt-5`}>
							{groups.map(({ group, detachments }, gi) => (
								<div key={gi} className="relative flex flex-col items-center">
									{/* riser from bus to group chip */}
									<div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-0.5 h-5 ${LINE}`} />
									<div className="bg-primary-900 border border-primary-500 rounded px-3 py-0.5 font-graduate uppercase text-xs tracking-widest text-primary-100">
										{group.type}
									</div>
									<div className={`w-0.5 h-4 ${LINE}`} />
									{/* stacked detachment nodes with a spine */}
									<div className="relative flex flex-col gap-3 pt-0">
										{detachments.map((det, di) => (
											<div key={det.slot_id} className="relative flex items-center">
												{di > 0 ? <div className={`absolute left-1/2 -top-3 -translate-x-1/2 w-0.5 h-3 ${LINE}`} /> : null}
												<DetachmentNode list={list} detachment={det} label={labels?.[det.slot_id]} />
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default OrgChart

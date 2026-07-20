"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { listState } from "@lists/state"
import { BreadCrumbs, Crumb } from "@components/BreadCrumbs"
import DetachmentDataslate from "@components/DetachmentDataslate"
import { detachmentData } from "@data/detachment_data"
import { unitData } from "@data/unit_data"
import { totalListPoints, totalFormationPoints } from "@lists/builder/utils"
import dynamic from "next/dynamic"
import { FaFileDownload } from "@react-icons/all-files/fa/FaFileDownload"
import PdfCardList from "./pdf/PdfCardList"
import CasualtyTracker from "./CasualtyTracker"
import OrgChart from "./OrgChart"
import { variantNotes, cardSignature, takenRelatedUnitIds, weaponRowState } from "./resolveWeapons"

const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
	ssr: false,
	loading: () => <span>Loading…</span>,
})

const page = () => {
	const { list } = listState()
	const [includeUnequipped, setIncludeUnequipped] = useState(false)
	const [showDupes, setShowDupes] = useState(false)
	const [sortByName, setSortByName] = useState(false)
	const [groupByFormation, setGroupByFormation] = useState(false)
	const [fullscreen, setFullscreen] = useState(false)

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
					return { slotId: det.slot_id, formationId: formation.id, det, data, sig: cardSignature(list, det) }
				})
				.filter((inst): inst is NonNullable<typeof inst> => Boolean(inst))
		)
	)

	// [A]/[B] labels for detachments that appear with more than one set of choices.
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

	type Inst = (typeof instances)[number]

	// Dedup by signature (unless showing duplicates) and sort by name or points.
	const dedupSort = (items: Inst[]) => {
		const seen = new Set<string>()
		return items
			.filter((inst) => showDupes || (!seen.has(inst.sig) && seen.add(inst.sig)))
			.sort((a, b) =>
				sortByName
					? a.data.name.localeCompare(b.data.name)
					: b.data.base_cost - a.data.base_cost || a.data.name.localeCompare(b.data.name)
			)
	}

	// One card. `scope` is the instance set searched for casualty-tracker siblings.
	const cardNode = (inst: Inst, scope: Inst[]) => {
		const rows = weaponRowState(list, inst.det, includeUnequipped)
		return (
			<div key={inst.slotId} className="break-inside-avoid mb-4">
				<DetachmentDataslate
					detachment={inst.data}
					visibleWeaponIds={rows.map((r) => r.id)}
					greyWeaponIds={rows.filter((r) => r.grey).map((r) => r.id)}
					notes={variantNotes(list, inst.det)}
					label={labelBySig[inst.sig]}
					visibleRelatedUnitIds={takenRelatedUnitIds(list, inst.det)}
					hideLoadoutText
					hideUpgrades
					footer={
						showDupes ? (
							<CasualtyTracker list={list} detachment={inst.det} />
						) : (
							scope
								.filter((i) => i.sig === inst.sig)
								.map((i, idx, arr) => (
									<CasualtyTracker
										key={i.slotId}
										list={list}
										detachment={i.det}
										label={arr.length > 1 ? `#${idx + 1}` : undefined}
									/>
								))
						)
					}
				/>
			</div>
		)
	}

	const gridClass = `columns-1 md:columns-2 xl:columns-3 ${fullscreen ? "2xl:columns-4" : ""} gap-4`

	const toggle = (checked: boolean, onChange: (v: boolean) => void, text: string) => (
		<label className="flex items-center gap-1 cursor-pointer">
			<input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
			{text}
		</label>
	)

	const toggles = (
		<div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-graduate text-sm">
			{toggle(includeUnequipped, setIncludeUnequipped, "Include unequipped")}
			{toggle(showDupes, setShowDupes, "Show duplicates")}
			{toggle(sortByName, setSortByName, "Sort by name")}
			{toggle(groupByFormation, setGroupByFormation, "Group by formation")}
		</div>
	)

	const cardGrid = groupByFormation ? (
		<div className="flex flex-col gap-6">
			{formations.map((formation) => {
				const formInstances = instances.filter((i) => i.formationId === formation.id)
				const items = dedupSort(formInstances)
				if (!items.length) return null
				return (
					<div key={formation.id}>
						<h3 className="font-graduate text-lg text-primary-100 border-b border-primary-600 pb-1 mb-2">
							{formation.nickname ? `${formation.nickname} — ` : ""}
							{formation.name} · {totalFormationPoints(list, formation)}pts
						</h3>
						<section className={gridClass}>{items.map((inst) => cardNode(inst, formInstances))}</section>
					</div>
				)
			})}
		</div>
	) : (
		<section className={gridClass}>{dedupSort(instances).map((inst) => cardNode(inst, instances))}</section>
	)

	if (fullscreen && typeof document !== "undefined") {
		// Portal to <body> so the overlay sits above the sticky nav.
		return createPortal(
			<div className="fixed inset-0 z-[100] bg-secondary-900 text-primary-50 overflow-auto p-4">
				<div className="sticky top-0 z-10 bg-secondary-900 flex flex-wrap items-center gap-4 pb-3 mb-3 border-b border-primary-700">
					<button
						onClick={() => setFullscreen(false)}
						className="clip-path-halfagon-md py-1 px-3 bg-backgrounds-900 hover:text-primary-400 font-graduate">
						Exit fullscreen
					</button>
					<span className="font-graduate font-bold">{list.name}</span>
					{toggles}
				</div>
				{cardGrid}
			</div>,
			document.body
		)
	}

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
				<div className="mt-2 flex flex-wrap items-center gap-4">
					{toggles}
					<button
						onClick={() => setFullscreen(true)}
						className="clip-path-halfagon-md py-1 px-3 bg-backgrounds-900 hover:text-primary-400 font-graduate">
						Fullscreen
					</button>
					<button className="flex items-center text-primary-500 hover:text-primary-400 active:text-tertiary-400 font-graduate">
						<PDFDownloadLink
							document={<PdfCardList list={list} includeUnequipped={includeUnequipped} />}
							fileName={`${list.name}-cards${includeUnequipped ? "-full" : ""}`}
							className="flex items-center">
							<FaFileDownload className="mr-1 text-xl" />
							Cards pdf
						</PDFDownloadLink>
					</button>
				</div>
			</div>

			{/* Force org chart (formation → category bands → detachment boxes) */}
			<section>
				<OrgChart list={list} labels={labelBySlot} />
			</section>

			{cardGrid}
		</div>
	)
}

export default page

"use client"

import { useEffect, useState } from "react"
import { List, ListDetachment } from "@type/listTypes"
import { casualtyUnits, voidShieldUnits } from "./resolveWeapons"

// Persisted tick state for one section (casualties or void shields).
const useTicks = (storageKey: string) => {
	const [ticked, setTicked] = useState<Record<string, boolean>>({})
	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(storageKey)
			setTicked(stored ? JSON.parse(stored) : {})
		} catch {
			setTicked({})
		}
	}, [storageKey])
	const toggle = (key: string) =>
		setTicked((prev) => {
			const next = { ...prev, [key]: !prev[key] }
			try {
				window.localStorage.setItem(storageKey, JSON.stringify(next))
			} catch {}
			return next
		})
	const reset = () => {
		setTicked({})
		try {
			window.localStorage.removeItem(storageKey)
		} catch {}
	}
	return { ticked, toggle, reset }
}

// Diagonal "split" look for void-shield boxes (distinct from casualty squares).
const SHIELD_SPLIT = { backgroundImage: "linear-gradient(135deg, transparent 44%, #0b3d2c 44%, #0b3d2c 56%, transparent 56%)" }

// Interactive tracker for the on-screen card view: click a box to mark damage /
// a downed void shield, click again to clear. State persists per list+detachment.
const CasualtyTracker = ({
	list,
	detachment,
	label,
}: {
	list: List
	detachment: ListDetachment
	label?: string
}) => {
	const units = casualtyUnits(list, detachment)
	const shieldUnits = voidShieldUnits(list, detachment)
	const cas = useTicks(`casualties:${list.id}:${detachment.slot_id}`)
	const vs = useTicks(`voidshields:${list.id}:${detachment.slot_id}`)

	if (!units.length && !shieldUnits.length) return null

	return (
		<div className="mt-2 border-t-2 sm:border-2 border-black bg-dataslate text-primary-950">
			{/* Casualties */}
			{units.length ? (
				<>
					<div className="flex justify-between items-center bg-backgrounds-950 text-primary-50 px-2 py-1">
						<h3 className="font-bold">Casualties{label ? ` ${label}` : ""}</h3>
						<button onClick={cas.reset} className="text-xs hover:text-primary-400 active:text-tertiary-400">
							reset
						</button>
					</div>
					<div className="p-2 flex flex-col gap-1">
						{units.map((unit) => (
							<div key={unit.name}>
								{units.length > 1 ? (
									<p className="font-graduate text-xs sm:text-sm">
										{unit.number} {unit.name}
									</p>
								) : null}
								<div className="flex flex-wrap gap-1">
									{Array.from({ length: unit.number }).map((_, m) => (
										<div key={m} className="flex gap-[2px] border border-black rounded p-[2px]">
											{Array.from({ length: unit.wounds }).map((__, w) => {
												const key = `${unit.name}-${m}-${w}`
												return (
													<button
														key={w}
														onClick={() => cas.toggle(key)}
														aria-label={`${unit.name} model ${m + 1} wound ${w + 1}`}
														className={`w-4 h-4 border border-black rounded-sm transition-colors ${
															cas.ticked[key] ? "bg-red-600" : "bg-white hover:bg-red-200"
														}`}
													/>
												)
											})}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</>
			) : null}

			{/* Void Shields */}
			{shieldUnits.length ? (
				<>
					<div className="flex justify-between items-center bg-primary-950 text-primary-50 px-2 py-1 border-t border-black">
						<h3 className="font-bold">Void Shields</h3>
						<button onClick={vs.reset} className="text-xs hover:text-primary-400 active:text-tertiary-400">
							reset
						</button>
					</div>
					<div className="p-2 flex flex-col gap-1">
						{shieldUnits.map((unit) => (
							<div key={unit.name}>
								{shieldUnits.length > 1 || unit.number > 1 ? (
									<p className="font-graduate text-xs sm:text-sm">
										{unit.number} {unit.name} · {unit.shields} shields each
									</p>
								) : null}
								<div className="flex flex-wrap gap-1">
									{Array.from({ length: unit.number }).map((_, m) => (
										<div key={m} className="flex gap-[2px] border border-black rounded p-[2px]">
											{Array.from({ length: unit.shields }).map((__, s) => {
												const key = `${unit.name}-${m}-${s}`
												const down = vs.ticked[key]
												return (
													<button
														key={s}
														onClick={() => vs.toggle(key)}
														aria-label={`${unit.name} model ${m + 1} void shield ${s + 1}`}
														style={down ? undefined : SHIELD_SPLIT}
														className={`w-4 h-4 border border-black rounded-sm transition-colors ${
															down ? "bg-primary-700" : "bg-white hover:bg-primary-200"
														}`}
													/>
												)
											})}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</>
			) : null}
		</div>
	)
}

export default CasualtyTracker

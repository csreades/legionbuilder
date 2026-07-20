"use client"

import { useEffect, useState } from "react"
import { List, ListDetachment } from "@type/listTypes"
import { casualtyUnits } from "./resolveWeapons"

// Interactive casualty tracker for the on-screen card view: click a wound box to
// mark damage, click again to clear. State persists per list+detachment in
// localStorage so it survives refreshes during a game.
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
	const storageKey = `casualties:${list.id}:${detachment.slot_id}`
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

	if (!units.length) return null

	return (
		<div className="mt-2 border-t-2 sm:border-2 border-black">
			<div className="flex justify-between items-center bg-backgrounds-950 text-primary-50 px-2 py-1">
				<h3 className="font-bold">Casualties{label ? ` ${label}` : ""}</h3>
				<button onClick={reset} className="text-xs hover:text-primary-400 active:text-tertiary-400">
					reset
				</button>
			</div>
			<div className="p-2 flex flex-col gap-1 bg-dataslate text-primary-950">
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
												onClick={() => toggle(key)}
												aria-label={`${unit.name} model ${m + 1} wound ${w + 1}`}
												className={`w-4 h-4 border border-black rounded-sm transition-colors ${
													ticked[key] ? "bg-red-600" : "bg-white hover:bg-red-200"
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
		</div>
	)
}

export default CasualtyTracker

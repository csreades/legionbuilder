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

// A row of model boxes; each model box holds `count` cells rendered by `cell`.
const BoxGrid = ({
	units,
	count,
	cell,
}: {
	units: { name: string; number: number }[]
	count: (u: any) => number
	cell: (unitName: string, m: number, i: number) => React.ReactNode
}) => (
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
							{Array.from({ length: count(unit) }).map((__, i) => cell(unit.name, m, i))}
						</div>
					))}
				</div>
			</div>
		))}
	</div>
)

const Header = ({ title, onReset }: { title: string; onReset: () => void }) => (
	<div className="flex justify-between items-center bg-backgrounds-950 text-primary-50 px-2 py-1">
		<h3 className="font-bold">{title}</h3>
		<button onClick={onReset} className="text-xs hover:text-primary-400 active:text-tertiary-400">
			reset
		</button>
	</div>
)

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
		<div className="mt-2 border-t-2 sm:border-2 border-black bg-dataslate text-primary-950 flex flex-wrap">
			{units.length ? (
				<div className="grow basis-0 min-w-[48%]">
					<Header title={`Casualties${label ? ` ${label}` : ""}`} onReset={cas.reset} />
					<BoxGrid
						units={units}
						count={(u) => u.wounds}
						cell={(name, m, w) => {
							const key = `${name}-${m}-${w}`
							return (
								<button
									key={w}
									onClick={() => cas.toggle(key)}
									aria-label={`${name} model ${m + 1} wound ${w + 1}`}
									className={`w-4 h-4 border border-black rounded-sm transition-colors ${
										cas.ticked[key] ? "bg-red-600" : "bg-white hover:bg-red-200"
									}`}
								/>
							)
						}}
					/>
				</div>
			) : null}

			{shieldUnits.length ? (
				<div className={`grow basis-0 min-w-[48%] ${units.length ? "border-l border-black" : ""}`}>
					<Header title="Void Shields" onReset={vs.reset} />
					<BoxGrid
						units={shieldUnits}
						count={(u) => u.shields}
						cell={(name, m, s) => {
							const key = `${name}-${m}-${s}`
							const down = vs.ticked[key]
							return (
								<button
									key={s}
									onClick={() => vs.toggle(key)}
									aria-label={`${name} model ${m + 1} void shield ${s + 1}`}
									style={down ? undefined : SHIELD_SPLIT}
									className={`w-4 h-4 border border-black rounded-sm transition-colors ${
										down ? "bg-primary-700" : "bg-white hover:bg-primary-200"
									}`}
								/>
							)
						}}
					/>
				</div>
			) : null}
		</div>
	)
}

export default CasualtyTracker

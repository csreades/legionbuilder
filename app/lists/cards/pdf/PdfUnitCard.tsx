import React from "react"
import { StyleSheet, Text, View } from "@react-pdf/renderer"
import { List, ListDetachment } from "@type/listTypes"
import { detachmentData } from "@data/detachment_data"
import { unitData } from "@data/unit_data"
import { weapons as weaponData } from "@data/weapon_data"
import { currentDetachmentSize, totalDetachmentPoints } from "@lists/builder/components/detachment/utils"
import { weaponRowState, variantNotes } from "@lists/cards/resolveWeapons"
import { cardPdfStyles } from "./cardPdfStyles"

const styles = StyleSheet.create(cardPdfStyles)

// column widths
const S = { name: "34%", stat: "13.2%" }
const W = { weapon: "27%", col: "11%", traits: "29%" }

const line = (v: string | number | null) => (v === null || v === undefined || v === "" ? "-" : String(v))

interface properties {
	list: List
	detachment: ListDetachment
	label?: string
	includeUnequipped?: boolean
}

const PdfUnitCard = ({ list, detachment, label, includeUnequipped }: properties) => {
	const data = detachmentData.find((entry) => entry.id === detachment.id)
	if (!data) return null
	const mainUnits = unitData.filter((unit) => data.main_unit.includes(unit.id))
	if (!mainUnits.length) return null

	const size = currentDetachmentSize(list, detachment.slot_id)
	const points = totalDetachmentPoints(list, detachment.slot_id)
	const notes = variantNotes(list, detachment)

	const cardWeapons = weaponRowState(list, detachment, !!includeUnequipped)
		.map((r) => ({ weapon: weaponData.find((w) => w.id === r.id) as any, grey: r.grey }))
		.filter((r) => r.weapon)

	const unitType = mainUnits[0].unit_type

	// Casualty tracking: model counts + wounds per unit type (base unit + upgrade-added
	// units), merged by name — same shape the damage-box view uses.
	const baseUnit = unitData.find((u) => u.id === data.main_unit[0])
	const upgradeList = list.upgrades.find((u) => u.slot_id === detachment.slot_id)?.upgrades || []
	const rawUnits = [
		// main unit count is the detachment's own size (upgrades add their own rows below)
		baseUnit ? { name: baseUnit.name, number: detachment.size, wounds: baseUnit.wounds || 1 } : null,
		...upgradeList.map((up) => {
			const ui = unitData.find((u) => u.id === up.unit_ref)
			return ui ? { name: ui.name, number: up.size, wounds: ui.wounds || 1 } : null
		}),
	].filter(Boolean) as { name: string; number: number; wounds: number }[]
	const casualtyUnits = Array.from(new Set(rawUnits.map((u) => u.name))).map((name) => {
		const items = rawUnits.filter((u) => u.name === name)
		return { name, number: items.reduce((acc, u) => acc + u.number, 0), wounds: items[0].wounds }
	})

	return (
		<View style={styles.card} wrap={false}>
			{/* Header */}
			<View style={styles.cardHeader}>
				<Text style={styles.cardName}>
					{data.name}
					{label ? ` [${label}]` : ""}
				</Text>
				<Text style={styles.cardPoints}>{points} pts</Text>
			</View>

			{/* Type + size */}
			<View style={styles.typeBar}>
				<Text>
					{unitType.type} ({unitType.value})
				</Text>
				<Text>Detachment size: {size}</Text>
			</View>

			{/* Variant / specialist notes */}
			{notes.length ? (
				<View style={styles.notes}>
					{notes.map((note) => (
						<Text key={note}>{note}</Text>
					))}
				</View>
			) : null}

			{/* Unit stats */}
			<View style={styles.tHeader}>
				<Text style={[styles.cell, { width: S.name }]}>Name</Text>
				<Text style={[styles.cellCenter, { width: S.stat }]}>Move</Text>
				<Text style={[styles.cellCenter, { width: S.stat }]}>Save</Text>
				<Text style={[styles.cellCenter, { width: S.stat }]}>CAF</Text>
				<Text style={[styles.cellCenter, { width: S.stat }]}>Morale</Text>
				<Text style={[styles.cellCenter, { width: S.stat }]}>W</Text>
			</View>
			{mainUnits.map((unit, i) => (
				<View style={i % 2 ? styles.tRowAlt : styles.tRow} key={unit.id}>
					<Text style={[styles.cell, { width: S.name }]}>{unit.name}</Text>
					<Text style={[styles.cellCenter, { width: S.stat }]}>{unit.movement}</Text>
					<Text style={[styles.cellCenter, { width: S.stat }]}>{unit.save}+</Text>
					<Text style={[styles.cellCenter, { width: S.stat }]}>
						{Number(unit.caf) >= 0 ? "+" : ""}
						{unit.caf}
					</Text>
					<Text style={[styles.cellCenter, { width: S.stat }]}>{unit.morale ? `${unit.morale}+` : "-"}</Text>
					<Text style={[styles.cellCenter, { width: S.stat }]}>{unit.wounds}</Text>
				</View>
			))}

			{/* Weapons (filtered to selections) */}
			{cardWeapons.length ? (
				<>
					<View style={styles.tHeader}>
						<Text style={[styles.cell, { width: W.weapon }]}>Weapon</Text>
						<Text style={[styles.cellCenter, { width: W.col }]}>Range</Text>
						<Text style={[styles.cellCenter, { width: W.col }]}>Dice</Text>
						<Text style={[styles.cellCenter, { width: W.col }]}>To Hit</Text>
						<Text style={[styles.cellCenter, { width: W.col }]}>AP</Text>
						<Text style={[styles.cell, { width: W.traits }]}>Traits</Text>
					</View>
					{cardWeapons.map(({ weapon, grey }, i) => {
						const g = grey ? styles.greyText : {}
						return (
							<View style={i % 2 ? styles.tRowAlt : styles.tRow} key={weapon.id}>
								<Text style={[styles.cell, { width: W.weapon }, g]}>{weapon.name}</Text>
								<Text style={[styles.cellCenter, { width: W.col }, g]}>
									{weapon.profiles.map((p: any, k: number) => (
										<Text key={k}>{line(p.range)}{"\n"}</Text>
									))}
								</Text>
								<Text style={[styles.cellCenter, { width: W.col }, g]}>
									{weapon.profiles.map((p: any, k: number) => (
										<Text key={k}>{line(p.dice)}{"\n"}</Text>
									))}
								</Text>
								<Text style={[styles.cellCenter, { width: W.col }, g]}>
									{weapon.profiles.map((p: any, k: number) => (
										<Text key={k}>{p.to_hit ? `${p.to_hit}+` : "-"}{"\n"}</Text>
									))}
								</Text>
								<Text style={[styles.cellCenter, { width: W.col }, g]}>
									{weapon.profiles.map((p: any, k: number) => (
										<Text key={k}>
											{typeof p.ap === "number" ? (p.ap ? `-${p.ap}` : p.ap) : p.ap}
											{"\n"}
										</Text>
									))}
								</Text>
								<Text style={[styles.cell, { width: W.traits }, g]}>
									{weapon.profiles
										.map((p: any) =>
											p.traits.map((t: any) => `${t.name}${t.value ? ` (${t.value})` : ""}`).join(", ")
										)
										.join(" / ")}
								</Text>
							</View>
						)
					})}
				</>
			) : null}

			{/* Special rules */}
			{mainUnits[0].special_rules.length ? (
				<>
					<Text style={styles.sectionBar}>Special Rules</Text>
					<Text style={styles.rules}>
						{mainUnits[0].special_rules
							.map((rule: any) => `${rule.name}${rule.value ? ` (${rule.value})` : ""}`)
							.join(", ")}
					</Text>
				</>
			) : null}

			{/* Casualties — one outer box per model, split into wound-sized inner boxes */}
			<View style={styles.casualties}>
				<Text style={styles.casualtyLabel}>Casualties</Text>
				{casualtyUnits.map((unit) => (
					<View style={styles.casualtyUnit} key={unit.name}>
						{casualtyUnits.length > 1 ? (
							<Text style={styles.casualtyUnitName}>
								{unit.number} {unit.name}
							</Text>
						) : null}
						<View style={styles.boxRow}>
							{new Array(unit.number).fill(0).map((_, m) => (
								<View style={styles.modelBox} key={m}>
									{new Array(unit.wounds).fill(0).map((__, w) => (
										<View style={styles.woundBox} key={w} />
									))}
								</View>
							))}
						</View>
					</View>
				))}
			</View>
		</View>
	)
}

export default PdfUnitCard

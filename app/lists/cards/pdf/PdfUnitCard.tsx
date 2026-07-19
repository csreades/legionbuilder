import React from "react"
import { StyleSheet, Text, View } from "@react-pdf/renderer"
import { List, ListDetachment } from "@type/listTypes"
import { detachmentData } from "@data/detachment_data"
import { unitData } from "@data/unit_data"
import { weapons as weaponData } from "@data/weapon_data"
import { currentDetachmentSize, totalDetachmentPoints } from "@lists/builder/components/detachment/utils"
import { visibleWeaponIds, variantNotes } from "@lists/cards/resolveWeapons"
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
}

const PdfUnitCard = ({ list, detachment, label }: properties) => {
	const data = detachmentData.find((entry) => entry.id === detachment.id)
	if (!data) return null
	const mainUnits = unitData.filter((unit) => data.main_unit.includes(unit.id))
	if (!mainUnits.length) return null

	const size = currentDetachmentSize(list, detachment.slot_id)
	const points = totalDetachmentPoints(list, detachment.slot_id)
	const notes = variantNotes(list, detachment)

	const shownIds = visibleWeaponIds(list, detachment)
	const shownWeaponIds = Array.from(new Set(mainUnits.flatMap((u) => u.weapons))).filter((id) =>
		shownIds.includes(id)
	)
	const cardWeapons = shownWeaponIds.map((id) => weaponData.find((w) => w.id === id)).filter(Boolean) as any[]

	const unitType = mainUnits[0].unit_type

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
					{cardWeapons.map((weapon, i) => (
						<View style={i % 2 ? styles.tRowAlt : styles.tRow} key={weapon.id}>
							<Text style={[styles.cell, { width: W.weapon }]}>{weapon.name}</Text>
							<Text style={[styles.cellCenter, { width: W.col }]}>
								{weapon.profiles.map((p: any, k: number) => (
									<Text key={k}>{line(p.range)}{"\n"}</Text>
								))}
							</Text>
							<Text style={[styles.cellCenter, { width: W.col }]}>
								{weapon.profiles.map((p: any, k: number) => (
									<Text key={k}>{line(p.dice)}{"\n"}</Text>
								))}
							</Text>
							<Text style={[styles.cellCenter, { width: W.col }]}>
								{weapon.profiles.map((p: any, k: number) => (
									<Text key={k}>{p.to_hit ? `${p.to_hit}+` : "-"}{"\n"}</Text>
								))}
							</Text>
							<Text style={[styles.cellCenter, { width: W.col }]}>
								{weapon.profiles.map((p: any, k: number) => (
									<Text key={k}>
										{typeof p.ap === "number" ? (p.ap ? `-${p.ap}` : p.ap) : p.ap}
										{"\n"}
									</Text>
								))}
							</Text>
							<Text style={[styles.cell, { width: W.traits }]}>
								{weapon.profiles
									.map((p: any) =>
										p.traits.map((t: any) => `${t.name}${t.value ? ` (${t.value})` : ""}`).join(", ")
									)
									.join(" / ")}
							</Text>
						</View>
					))}
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

			{/* Casualty tick boxes — one per model */}
			<View style={styles.casualties}>
				<Text style={styles.casualtyLabel}>Casualties</Text>
				<View style={styles.boxRow}>
					{new Array(size).fill(0).map((_, i) => (
						<View key={i} style={styles.tickBox} />
					))}
				</View>
			</View>
		</View>
	)
}

export default PdfUnitCard

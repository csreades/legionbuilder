import React from "react"
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { List } from "@type/listTypes"
import { formationData } from "@data/formation_data"
import { detachmentData } from "@data/detachment_data"
import { unitData } from "@data/unit_data"
import { findFormationDetachmentBreakSlotIds, totalFormationPoints } from "@lists/builder/utils"
import { sum } from "@app/utils/math"
import { cardPdfStyles } from "./cardPdfStyles"
import PdfUnitCard from "./PdfUnitCard"

const styles = StyleSheet.create(cardPdfStyles)

const formationBreak = (list: List, formation: List["formations"][number]) => {
	const slot_ids = findFormationDetachmentBreakSlotIds(formation)
	const det = sum(
		list.detachments
			.filter((d) => slot_ids.includes(d.slot_id))
			.map((d) => (d.break_strength === 0 ? 0 : d.break_strength ? d.size * d.break_strength : d.size))
	)
	const up = sum(
		list.upgrades
			.filter((u) => slot_ids.includes(u.slot_id))
			.flatMap((u) =>
				u.upgrades.map((e) => (e.break_strength === 0 ? 0 : e.break_strength ? e.break_strength * e.size : e.size))
			)
	)
	const strength = det + up
	return { strength, breakPoint: Math.ceil(strength / 2) }
}

const PdfCardList = ({ list, includeUnequipped }: { list: List; includeUnequipped?: boolean }) => {
	const formations = list.formations.filter((formation) => formation.name)

	return (
		<Document title={`${list.name} - cards`}>
			{formations.map((formation) => {
				const data = formationData.find((f) => f.id === formation.data_id)
				const { strength, breakPoint } = formationBreak(list, formation)

				const detachments = formation.detachment_groups
					.flatMap((group) =>
						group.detachment_slots.map((slot) =>
							list.detachments.find((det) => det.slot_id === slot.id && det.id)
						)
					)
					.filter((det): det is NonNullable<typeof det> => Boolean(det))
					// only detachments that resolve to a unit datasheet (skip commanders etc.)
					.filter((det) => {
						const data = detachmentData.find((x) => x.id === det.id)
						return data?.main_unit.some((id) => unitData.some((u) => u.id === id))
					})

				return (
					<Page key={formation.id} size="A4" orientation="landscape" style={styles.page}>
						<View style={styles.formationHeader}>
							<View style={styles.formationTop}>
								<Text style={styles.formationTitle}>
									{formation.nickname ? `${formation.nickname} — ` : ""}
									{formation.name}
								</Text>
								<Text style={styles.formationPoints}>{totalFormationPoints(list, formation)} points</Text>
								<Text style={styles.formationStrength}>
									Formation Strength: {strength}; Break Point: {breakPoint}
								</Text>
							</View>
							{data?.rules.length ? (
								<Text style={styles.formationRule}>
									{data.rules.map((rule) => (rule.name ? `${rule.name}: ${rule.text}` : rule.text)).join("  ")}
								</Text>
							) : null}
						</View>

						<View style={styles.columns}>
							{[0, 1, 2].map((ci) => (
								<View style={styles.column} key={ci}>
									{detachments
										.filter((_, i) => i % 3 === ci)
										.map((det) => (
											<View style={styles.cardWrap} key={det.slot_id}>
												<PdfUnitCard
													list={list}
													detachment={det}
													includeUnequipped={includeUnequipped}
												/>
											</View>
										))}
								</View>
							))}
						</View>
					</Page>
				)
			})}
		</Document>
	)
}

export default PdfCardList

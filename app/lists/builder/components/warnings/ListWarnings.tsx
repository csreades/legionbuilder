import { listState } from "@/app/lists/state"
import { detachmentData } from "@data/detachment_data"
import { totalListPoints } from "../../utils"
import { listHasUnselectedLoadouts } from "../detachment/utils"
import SimpleWarning from "./SimpleWarning"

const ListWarnings = () => {
	const { list } = listState()

	const { mainFactionPoints, totalPoints } = totalListPoints(list)

	const allegianceArray = list.detachments
		.map((detachment) => detachment.allegiance)
		.filter((allegiance) => allegiance !== null && allegiance !== list.allegiance)

	// Per-points detachment caps (e.g. Legate Commander: one per 1500pts). Count by
	// name so variant ids of the same detachment share one limit.
	const limitCounts: Record<string, { count: number; limit: number }> = {}
	list.detachments.forEach((detachment) => {
		const data = detachmentData.find((entry) => entry.id === detachment.id)
		if (!data?.points_limit) return
		limitCounts[data.name] = limitCounts[data.name] || { count: 0, limit: data.points_limit }
		limitCounts[data.name].count += 1
	})
	const limitWarnings = Object.entries(limitCounts)
		.map(([name, { count, limit }]) => {
			const max = Math.floor(list.points / limit)
			return count > max ? `Too many ${name} (max ${max} at ${list.points}pts)` : null
		})
		.filter(Boolean)

	return (
		<div className="text-red-600 font-graduate">
			{totalPoints > list.points && <SimpleWarning>Total points for list has exceeded game size</SimpleWarning>}
			{mainFactionPoints < list.points * 0.7 && list.gamemode !== "titandeath" && (
				<SimpleWarning>Main faction must be at least 70% of list</SimpleWarning>
			)}
			{allegianceArray.length ? <SimpleWarning>Detachments with wrong allegiance</SimpleWarning> : null}
			{listHasUnselectedLoadouts(list) ? <SimpleWarning>Detachments have unselected loadouts</SimpleWarning> : null}
			{limitWarnings.map((message) => (
				<SimpleWarning key={message as string}>{message}</SimpleWarning>
			))}
		</div>
	)
}

export default ListWarnings

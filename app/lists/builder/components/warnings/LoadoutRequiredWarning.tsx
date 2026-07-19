import { unselectedLoadoutLocations } from "../detachment/utils"
import { listState } from "@/app/lists/state"

interface properties {
	slot_id: string
}

// Flags mandatory loadout choices (free either/or weapon fits) that haven't been
// selected for every model in the detachment yet.
const LoadoutRequiredWarning = ({ slot_id }: properties) => {
	const { list } = listState()

	const unselected = unselectedLoadoutLocations(list, slot_id)
	if (!unselected.length) return null

	return (
		<div className="text-red-500 font-graduate text-center">
			{unselected.map((location) => (
				<div key={slot_id + "-loadout-required-" + location}>Loadout not selected: {location}</div>
			))}
		</div>
	)
}

export default LoadoutRequiredWarning

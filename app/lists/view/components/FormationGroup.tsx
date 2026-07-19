import { ListFormationGroup, List } from "@type/listTypes"
import Detachment from "./Detachment"

interface properties {
	list: List
	formationGroup: ListFormationGroup
	labels?: Record<string, string>
}

const FormationGroup = ({ list, formationGroup, labels }: properties) => {
	const groupIds = formationGroup.detachment_slots.map((slot) => slot.id)
	const detachments = list.detachments
		.filter((detachment) => groupIds.includes(detachment.slot_id))
		.filter((detachment) => detachment.id)

	if (!detachments.length) {
		return null
	}

	return (
		<div className="pt-1 flex flex-col gap-1">
			<h4 className="font-bold capitalize font-graduate">{formationGroup.type}</h4>
			{detachments.map((detachment, index) => (
				<Detachment
					key={`${formationGroup.id}detachment${index}`}
					list={list}
					detachment={detachment}
					label={labels?.[detachment.slot_id]}
				/>
			))}
		</div>
	)
}

export default FormationGroup

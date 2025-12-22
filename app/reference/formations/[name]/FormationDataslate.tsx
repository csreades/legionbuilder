import { FORMATION } from "@type/types"
import FormationGroups from "@app/reference/formations/[name]/FormationGroups"
import FormationRule from "@app/reference/formations/[name]/FormationRule"

interface properties {
	formation: FORMATION
}
const FormationDataslate = ({ formation }: properties) => {
	const iconicPoints = formation.points && (
		<div className={"b-2 px-2 my-2 space-y-2 border border-primary-900"}>
			<div className={"text-primary-900 flex flex-wrap justify-between md:justify-center md:space-x-10 px-4"}>
				<div className={"font-bold font-graduate"}> Compulsory: {formation.points.compulsory}pts</div>
				<div className={"font-bold font-graduate"}> Optional: {formation.points.optional}pts</div>
				<div className={"font-bold font-graduate"}>
					{" "}
					Total: {formation.points.optional + formation.points.compulsory}pts
				</div>
			</div>
		</div>
	)

	const formationRules = formation.rules.length ? (
		<div className="pb-2 px-2 space-y-2">
			{formation.rules.map((rule, index) => {
				return <FormationRule rule={rule} key={`${formation.name}-rule-${index}`} />
			})}
		</div>
	) : null

	const formationSlots = formation.formation_slots.map((formationSlots, index) => {
		return <FormationGroups formationSlots={formationSlots} key={formationSlots.slot_type + index} />
	})

	return (
		<article className="max-w-screen-xl sm:p-2 bg-dataslate clip-path-halfagon-lg">
			<div className="border-2 border-black bg-primary-950 text-primary-50 py-1 px-3 mb-2">
				<h2 className="text-2xl py-1 text-center font-graduate font-bold">
					{formation.subfaction ? formation.subfaction + ": " : ""}
					{formation.name}
				</h2>
			</div>
			{iconicPoints}
			{formationRules}
			{formationSlots}
		</article>
	)
}

export default FormationDataslate

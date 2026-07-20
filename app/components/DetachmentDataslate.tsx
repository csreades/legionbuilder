import Link from "next/link"
import { DETACHMENT } from "@type/types"
import { unitData } from "@/app/data/unit_data"
import { notFound } from "next/navigation"
import { weapons } from "@/app/data/weapon_data"
import { getUnitWeaponRows } from "@/app/utils/unitweaponrows"
import SpecialRuleBox from "@components/SpecialRuleBox"
import UnitDataslate from "./UnitDataslate"
import { FaExternalLinkAlt } from "react-icons/fa"

interface properties {
	detachment: DETACHMENT
	no_related?: boolean
	// When provided, the weapon stats table is filtered to these weapon ids
	// (used by the card list to hide unselected loadout options).
	visibleWeaponIds?: number[]
	// Variant/specialist selections (e.g. "Chassis: Knight Errant") shown as notes.
	notes?: string[]
	// Hide the generic "X or Y" options prose (card list uses the filtered table instead).
	hideLoadoutText?: boolean
	// Hide the generic "can purchase the following upgrades" list (already selected in the list).
	hideUpgrades?: boolean
	// Disambiguation label (e.g. "A"/"B") when the same detachment appears with different choices.
	label?: string
	// When provided, only these related ("Additional") unit ids are shown (those actually taken).
	visibleRelatedUnitIds?: number[]
	// Weapon ids to render greyed (unequipped options, "include unequipped" mode).
	greyWeaponIds?: number[]
}

const DetachmentDataslate = ({
	detachment,
	no_related,
	visibleWeaponIds,
	notes,
	hideLoadoutText,
	hideUpgrades,
	label,
	visibleRelatedUnitIds,
	greyWeaponIds,
}: properties) => {
	const relatedShown = visibleRelatedUnitIds
		? detachment.related_unit.filter((id) => visibleRelatedUnitIds.includes(id))
		: detachment.related_unit
	const mainUnit = unitData.filter((unit) => detachment.main_unit.includes(unit.id))
	if (!mainUnit.length) {
		notFound()
	}

	const mainUnitBasicStats = mainUnit.map((unit) => {
		return (
			<tr key={unit.name}>
				<td className="text-start px-2">
					<Link
						href={`/reference/units/${unit.name.replaceAll(" ", "_")}`}
						className="flex items-center gap-2 hover:text-tertiary-700 active:text-tertiary-600">
						{unit.name} <FaExternalLinkAlt />
					</Link>
				</td>
				<td className="text-center">{unit.movement}</td>
				<td className="text-center">{unit.save}+</td>
				<td className="text-center">
					{unit.caf >= 0 ? "+" : ""}
					{unit.caf}
				</td>
				<td className="text-center">{unit.morale ? unit.morale + "+" : "-"}</td>
				<td className="text-center pr-4">{unit.wounds}</td>
			</tr>
		)
	})

	const mainUnitWeaponsArray = Array.from(new Set(mainUnit.map((unit) => unit.weapons).flat()))
	const shownWeapons = visibleWeaponIds
		? mainUnitWeaponsArray.filter((id) => visibleWeaponIds.includes(id))
		: mainUnitWeaponsArray

	const weaponRows = getUnitWeaponRows(shownWeapons, greyWeaponIds ? new Set(greyWeaponIds) : undefined)

	return (
		<article className="max-w-screen-xl p-1 sm:p-4 bg-dataslate text-sm sm:text-base break-inside-avoid clip-path-halfagon-lg">
			{/* TITLE */}
			<div className="flex justify-between items-center gap-2 sm:border-2 border-black bg-primary-950 text-primary-50 py-1 px-3 mb-2">
				<h2 className="text-xl sm:text-2xl font-graduate font-bold">
					{detachment.name}
					{label ? ` [${label}]` : ""}
				</h2>
				<h3 className="text-lg sm:text-xl font-graduate">{detachment.base_cost} Points</h3>
			</div>

			<div className="flex justify-between sm:border-2 border-black bg-primary-950 text-primary-50 px-2 py-1 font-bold font-graduate">
				<p>
					{mainUnit[0].unit_type.type} {`(${mainUnit[0].unit_type.value})`}
				</p>
				<p>Detachment size: {detachment.base_size}</p>
			</div>

			{/* VARIANT / SPECIALIST NOTES */}
			{notes?.length ? (
				<div className="mt-2 border-t-2 border-b-2 sm:border-2 border-black bg-tertiary-100">
					{notes.map((note) => (
						<p key={note} className="text-primary-950 px-2 py-1 font-graduate">
							{note}
						</p>
					))}
				</div>
			) : null}

			{/* UNIT BASIC STATS */}
			<table className="w-full border-t-2 border-b-2 sm:border-2 border-black mt-2">
				<thead className="bg-primary-950 text-primary-50">
					<tr>
						<th className="text-start px-2">Name</th>
						<th className="text-center">Move</th>
						<th className="text-center">Save</th>
						<th className="text-center">CAF</th>
						<th className="text-center">Morale</th>
						<th className="text-center pr-4">W</th>
					</tr>
				</thead>
				<tbody className="text-secondary-900">{mainUnitBasicStats}</tbody>
			</table>
			{/* DETACHMENT WEAPONS INFO */}
			{detachment.dataslate_loadout.length && !hideLoadoutText ? (
				<div className="mt-2 border-t-2 border-b-2 sm:border-2 border-black">
					<h3 className="bg-primary-950 text-primary-50 px-2 py-1 font-bold">Weapons</h3>
					{detachment.dataslate_loadout.map((loadout, index) => (
						<div key={"loadout" + index} className="text-primary-950 p-2 flex flex-col gap-1">
							{loadout.text ? <p>{loadout.text}</p> : null}
							{loadout.text_option ? (
								<ul className="list-disc grid sm:grid-cols-2">
									{loadout.text_option.map((option) => (
										<li key={option} className="ml-4">
											{option}
										</li>
									))}
								</ul>
							) : null}
							{loadout.weapon_option ? (
								<ul className="list-disc grid grid-cols-2">
									{loadout.weapon_option.map((weaponNumber) => {
										const foundWeapon = weapons.find((weapon) => weapon.id === weaponNumber)
										if (foundWeapon) {
											return (
												<li key={weaponNumber} className="ml-4">
													{foundWeapon.name}
												</li>
											)
										}
										return null
									})}
								</ul>
							) : null}
							{loadout.itallic_text ? <p className="italic opacity-60">{loadout.itallic_text}</p> : null}
						</div>
					))}
				</div>
			) : null}
			{/* WEAPON STATS SECTION */}
			{detachment.dataslate_loadout.length ? (
				<table className="w-full mt-4 sm:border-2 border-black">
					<thead className="bg-primary-950 text-primary-50">
						<tr>
							<th className="text-start px-2">Weapon</th>
							<th className="text-center">Range</th>
							<th className="text-center">Dice</th>
							<th className="text-center">To Hit</th>
							<th className="text-center">AP</th>
							<th className="text-start px-2">Traits</th>
						</tr>
					</thead>
					<tbody className="text-secondary-900">{weaponRows}</tbody>
				</table>
			) : null}

			{/* DATASHEET INFO */}
			{detachment.datasheet_info.length && !hideUpgrades ? (
				<div className="mt-2 border-t-2 border-b-2 sm:border-2 border-black">
					<h3 className="bg-primary-950 text-primary-50 px-2 py-1 font-bold">Upgrades</h3>
					{detachment.datasheet_info.map((info, index) => (
						<div key={"upgrades" + index} className="text-primary-950 p-2 flex flex-col gap-1">
							{info.text ? <p>{info.text}</p> : null}
							{info.options ? (
								<ul className="list-disc">
									{info.options.map((option) => (
										<li key={option.text} className="ml-4">
											<strong>{option.text}</strong>, +<strong>{option.cost}</strong> points,
										</li>
									))}
								</ul>
							) : null}
							{info.info ? <p className="italic">{info.info}</p> : null}
						</div>
					))}
				</div>
			) : null}
			{mainUnit[0].special_rules.length ? (
				<div className="mt-2 border-t-2 border-b-2 sm:border-2 border-black">
					<h3 className="bg-primary-950 text-primary-50 px-2 py-1 font-bold">Special Rules</h3>
					<div className="px-2 flex flex-wrap gap-1 text-secondary-900">
						{" "}
						{mainUnit[0].special_rules.sort().map((rule, index) => (
							<div key={rule.name + index} className="flex">
								<SpecialRuleBox rule={rule} />
								{index < mainUnit[0].special_rules.length - 1 ? "," : ""}
							</div>
						))}
					</div>
				</div>
			) : null}
			{relatedShown.length && !no_related ? (
				<div className="mt-2 sm:border-2 border-black">
					<h3 className="bg-primary-950 text-primary-50 px-2 py-1 mb-2 font-bold">Additional units</h3>
					<div className="flex flex-col gap-4">
						{relatedShown.map((unitNo) => {
							const foundUnit = unitData.find((unit) => unit.id === unitNo)
							if (foundUnit) {
								return <UnitDataslate key={foundUnit.name + unitNo} unit={foundUnit} />
							}
							return null
						})}
					</div>
				</div>
			) : null}
		</article>
	)
}

export default DetachmentDataslate

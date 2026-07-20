import { weaponTraitsData } from "../data/weapon_traits_data"
import { WEAPON_TRAIT } from "../types/types"

interface properties {
	trait: WEAPON_TRAIT
	disabled?: boolean
}

const traitSlug = (name: string) =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")

const WeaponTraitBox = ({ trait, disabled }: properties) => {
	const description = weaponTraitsData.find((weapon) => weapon.name.toLowerCase() === trait.name.toLowerCase())
	const href = `https://epicheresy.ru/li2023/legions_imperialis_rules/weapon_traits/#${traitSlug(trait.name)}`

	return (
		<span className="relative group/trait">
			<a
				href={href}
				target="_blank"
				rel="noreferrer"
				className={`${disabled ? "" : "cursor-pointer hover:text-primary-700 underline decoration-dotted underline-offset-2"} capitalize `}>{`${trait.name}${trait.value ? ` (${trait.value})` : ""}`}</a>
			{description?.tooltip ? (
				<div
					className={`absolute hidden ${disabled ? "" : "group-hover/trait:block"} z-20 -bottom-2 right-0 translate-y-full text-center w-[200px] sm:w-[300px]`}>
					<div className="clipped bg-backgrounds-950 text-primary-50 p-1 px-2 normal-case">
						{description?.tooltip ? description.tooltip : null}
					</div>
					<div className="top-0 absolute h-0 w-0 border-x-8 border-x-transparent border-b-[8px] border-b-primary-900 -translate-y-full right-8"></div>
				</div>
			) : null}
			<span className="group-last/trait:hidden">,&nbsp;</span>
		</span>
	)
}

export default WeaponTraitBox

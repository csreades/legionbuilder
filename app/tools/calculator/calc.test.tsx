import calculateAP from "./utils/calculateAP"
import calculateShotMultiplier from "./utils/calculateShotMultiplier"
import calculateToHit from "./utils/calculateToHit"
import calculateSaves from "./utils/calculateSaves"
import calculateDamage from "./utils/calculateDamage"
import { ALLEGIANCE, FACTION, UNIT_DATASHEET, UNIT_TYPE, WEAPON_PROFILES } from "@type/types"
import { SpecialRule } from "@type/specialRules"
import { WeaponTraits } from "@type/weaponTraits"

const testWeapon: WEAPON_PROFILES = { range: "1", dice: 1, to_hit: 4, ap: 0, traits: [] }

const testTarget: UNIT_DATASHEET = {
	id: 1,
	faction: FACTION.astartes,
	subfaction: null,
	allegiance: ALLEGIANCE.loyalist,
	unique: false,
	unit_type: { type: UNIT_TYPE.infantry, value: 1 },
	name: "Tester",
	movement: "10",
	save: 5,
	caf: 0,
	morale: null,
	wounds: 1,
	weapons: [],
	special_rules: [],
}

test("Calculate Shots", () => {
	expect(calculateShotMultiplier(testWeapon, testTarget)).toBe(1)
	expect(calculateShotMultiplier({ ...testWeapon, range: "T", dice: 0 }, testTarget)).toBe(1)
	expect(calculateShotMultiplier({ ...testWeapon, dice: 20 }, testTarget)).toBe(20)
	expect(calculateShotMultiplier({ ...testWeapon, dice: "-" }, testTarget)).toBe(1)
	expect(
		calculateShotMultiplier(
			{ ...testWeapon, traits: [{ name: WeaponTraits.gravitonPulse }, { name: WeaponTraits.demolisher }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 0 } }
		)
	).toBe(3)
	expect(
		calculateShotMultiplier(
			{
				...testWeapon,
				dice: 3,
				traits: [{ name: WeaponTraits.gravitonPulse }, { name: WeaponTraits.demolisher }],
			},
			{ ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 0 } }
		)
	).toBe(9)
})

test("Calculate To Hit", () => {
	expect(calculateToHit(testWeapon, testTarget)).toBe(0.5)
	expect(calculateToHit({ ...testWeapon, to_hit: null }, testTarget)).toBe(5 / 6)
	expect(calculateToHit({ ...testWeapon, to_hit: 0 }, testTarget)).toBe(5 / 6)
	expect(calculateToHit(testWeapon, { ...testTarget, special_rules: [{ name: SpecialRule.flyer }] })).toBe(1 / 6)
	expect(
		calculateToHit(
			{ ...testWeapon, traits: [{ name: WeaponTraits.skyfire }] },
			{ ...testTarget, special_rules: [{ name: SpecialRule.flyer }] }
		)
	).toBe(1 / 2)
	expect(
		calculateToHit(
			{ ...testWeapon, traits: [{ name: WeaponTraits.tracking }] },
			{ ...testTarget, special_rules: [{ name: SpecialRule.flyer }] }
		)
	).toBe(11 / 36)
	expect(
		calculateToHit(
			{ ...testWeapon, traits: [{ name: WeaponTraits.accurate }] },
			{ ...testTarget, special_rules: [{ name: SpecialRule.flyer }] }
		)
	).toBe(11 / 36)
	expect(calculateToHit({ ...testWeapon, traits: [{ name: WeaponTraits.accurate }] }, testTarget)).toBe(3 / 4)
	expect(calculateToHit({ ...testWeapon, traits: [{ name: WeaponTraits.rapidFire }] }, testTarget)).toBe(4 / 6)
	expect(calculateToHit({ ...testWeapon, to_hit: 2, traits: [{ name: WeaponTraits.rapidFire }] }, testTarget)).toBe(1)
	expect(
		calculateToHit(
			{ ...testWeapon, to_hit: 2, traits: [{ name: WeaponTraits.rapidFire }, { name: WeaponTraits.accurate }] },
			testTarget
		)
	).toBe(41 / 36)
	expect(calculateToHit({ ...testWeapon, to_hit: 7 }, testTarget)).toBe(1 / 6)
	expect(calculateToHit({ ...testWeapon, to_hit: 1 }, testTarget)).toBe(5 / 6)
	expect(calculateToHit(testWeapon, { ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 0 } })).toBe(
		2 / 3
	)
	expect(calculateToHit({ ...testWeapon, traits: [{ name: WeaponTraits.gravitonPulse }] }, testTarget)).toBe(1 / 3)
	expect(
		calculateToHit(
			{ ...testWeapon, traits: [{ name: WeaponTraits.gravitonPulse }] },
			{ ...testTarget, special_rules: [{ name: SpecialRule.flyer }] }
		)
	).toBe(1 / 6)
	expect(
		calculateToHit(
			{ ...testWeapon, traits: [{ name: WeaponTraits.gravitonPulse }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 0 } }
		)
	).toBe(2 / 3)
})

test("Calculate AP", () => {
	expect(calculateAP(testWeapon, testTarget)).toBe(0)
	expect(calculateAP({ ...testWeapon, ap: "-" }, testTarget)).toBe(0)
	expect(calculateAP({ ...testWeapon, ap: 1 }, testTarget)).toBe(1)
	expect(calculateAP({ ...testWeapon, ap: 4, traits: [{ name: WeaponTraits.antitank }] }, testTarget)).toBe(0)
	expect(
		calculateAP(
			{ ...testWeapon, ap: 3, traits: [{ name: WeaponTraits.antitank }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.vehicle, value: 1 } }
		)
	).toBe(3)
	expect(
		calculateAP(
			{ ...testWeapon, ap: 1, traits: [{ name: WeaponTraits.antitank }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.titan, value: 1 } }
		)
	).toBe(1)
	expect(
		calculateAP(
			{ ...testWeapon, traits: [{ name: "Burrowing" }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.vehicle, value: 1 } }
		)
	).toBe(1)
	expect(calculateAP({ ...testWeapon, traits: [{ name: "Burrowing" }] }, testTarget)).toBe(0)
	expect(
		calculateAP(
			{ ...testWeapon, ap: 3, traits: [{ name: "Light AT" }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.knight, value: 1 } }
		)
	).toBe(0)
	expect(
		calculateAP(
			{ ...testWeapon, ap: 3, traits: [{ name: WeaponTraits.light }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.vehicle, value: 1 } }
		)
	).toBe(3)
	expect(
		calculateAP(
			{ ...testWeapon, ap: 3, traits: [{ name: WeaponTraits.light }] },
			{ ...testTarget, special_rules: [{ name: SpecialRule.armoured }] }
		)
	).toBe(0)
})

test("Calulate Saves", () => {
	expect(calculateSaves(testWeapon, testTarget)).toBe(1 / 3)
	expect(
		calculateSaves(testWeapon, { ...testTarget, special_rules: [{ name: SpecialRule.invulnerableSave, value: 6 }] })
	).toBe(1 / 3)
	expect(
		calculateSaves(testWeapon, { ...testTarget, special_rules: [{ name: SpecialRule.invulnerableSave, value: 4 }] })
	).toBe(1 / 2)
	expect(
		calculateSaves(
			{ ...testWeapon, traits: [{ name: WeaponTraits.psi }] },
			{ ...testTarget, special_rules: [{ name: SpecialRule.invulnerableSave, value: 4 }] }
		)
	).toBe(1 / 3)
	expect(
		calculateSaves(testWeapon, {
			...testTarget,
			special_rules: [
				{ name: SpecialRule.invulnerableSave, value: 6 },
				{ name: SpecialRule.jink, value: 3 },
			],
		})
	).toBe(2 / 3)
	expect(calculateSaves(testWeapon, { ...testTarget, save: 1 })).toBe(1)
	expect(calculateSaves({ ...testWeapon, ap: 1 }, { ...testTarget, save: 6 })).toBe(0)
	expect(calculateSaves({ ...testWeapon, ap: 1 }, { ...testTarget, save: 3 })).toBe(1 / 2)
	expect(
		calculateSaves(
			{ ...testWeapon, traits: [{ name: WeaponTraits.armourbane }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.vehicle, value: 1 } }
		)
	).toBeCloseTo(1 / 9, 5)
	expect(
		calculateSaves(
			{ ...testWeapon, traits: [{ name: WeaponTraits.armourbane }] },
			{
				...testTarget,
				unit_type: { type: UNIT_TYPE.vehicle, value: 1 },
				special_rules: [{ name: SpecialRule.invulnerableSave, value: 3 }],
			}
		)
	).toBe(2 / 3)
	expect(
		calculateSaves(
			{ ...testWeapon, ap: 3, traits: [{ name: WeaponTraits.armourbane }] },
			{ ...testTarget, save: 1, unit_type: { type: UNIT_TYPE.titan, value: 1 } }
		)
	).toBeCloseTo(1 / 4, 5)
	expect(
		calculateSaves(
			{ ...testWeapon, ap: 3, traits: [{ name: WeaponTraits.light }] },
			{ ...testTarget, special_rules: [{ name: SpecialRule.armoured }] }
		)
	).toBeCloseTo(5 / 9, 5)
	expect(calculateSaves({ ...testWeapon, traits: [{ name: "Shred" }] }, testTarget)).toBeCloseTo(1 / 9, 5)
	expect(
		calculateSaves(
			{ ...testWeapon, traits: [{ name: "Neutron-flux" }] },
			{ ...testTarget, special_rules: [{ name: SpecialRule.cyberneticaCortex }] }
		)
	).toBeCloseTo(1 / 9, 5)
	expect(
		calculateSaves(
			{ ...testWeapon, ap: 5, traits: [{ name: "Blast" }] },
			{ ...testTarget, special_rules: [{ name: SpecialRule.exploratorAdaptation }] }
		)
	).toBeCloseTo(1 / 6, 5)
	expect(
		calculateSaves(
			{ ...testWeapon, traits: [{ name: WeaponTraits.demolisher }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 0 } }
		)
	).toBeCloseTo(5 / 6, 5)
	expect(
		calculateSaves(
			{ ...testWeapon, traits: [{ name: WeaponTraits.demolisher }] },
			{ ...testTarget, save: 2, unit_type: { type: UNIT_TYPE.structure, value: 0 } }
		)
	).toBe(1)
	expect(
		calculateSaves(
			{ ...testWeapon, traits: [{ name: WeaponTraits.gravitonPulse }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 0 } }
		)
	).toBeCloseTo(1 / 6, 5)
})

test("Calculate Damage", () => {
	expect(calculateDamage(testWeapon, testTarget)).toBe("0.33")
	expect(calculateDamage({ ...testWeapon, range: "-", to_hit: null }, testTarget)).toBe("Melee")
	expect(calculateDamage({ ...testWeapon, range: "T", dice: 0 }, testTarget)).toBe("0.33")
	expect(
		calculateDamage(
			{ ...testWeapon, traits: [{ name: WeaponTraits.light }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.knight, value: 4 } }
		)
	).toBe("0")
	expect(calculateDamage({ ...testWeapon, traits: [{ name: WeaponTraits.deflagrate }] }, testTarget)).toBe("0.44")
	expect(
		calculateDamage(
			{ ...testWeapon, traits: [{ name: WeaponTraits.deflagrate }, { name: WeaponTraits.light }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.cavalry, value: 1 } }
		)
	).toBe("0.44")
	expect(
		calculateDamage(
			{ ...testWeapon, traits: [{ name: WeaponTraits.deflagrate }, { name: WeaponTraits.light }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.knight, value: 4 } }
		)
	).toBe("0")
	expect(
		calculateDamage(
			{ ...testWeapon, traits: [{ name: WeaponTraits.deflagrate }, { name: WeaponTraits.light }] },
			{
				...testTarget,
				unit_type: { type: UNIT_TYPE.walker, value: 1 },
				special_rules: [{ name: SpecialRule.armoured }],
			}
		)
	).toBe("0.27")
	expect(calculateDamage(testWeapon, { ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 0 } })).toBe(
		"Immune"
	)
	expect(
		calculateDamage(
			{ ...testWeapon, range: "-", to_hit: null, traits: [{ name: WeaponTraits.wrecker }] },
			testTarget
		)
	).toBe("Melee")
	expect(
		calculateDamage(
			{ ...testWeapon, range: "-", to_hit: null },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 1 } }
		)
	).toBe("Immune")
	expect(
		calculateDamage(
			{ ...testWeapon, ap: 6, traits: [{ name: WeaponTraits.bunkerBuster }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 0 } }
		)
	).toBe("0.67")
	expect(
		calculateDamage(
			{ ...testWeapon, traits: [{ name: WeaponTraits.heavyBeam }] },
			{ ...testTarget, save: 2, unit_type: { type: UNIT_TYPE.structure, value: 0 } }
		)
	).toBe("0.00")
	expect(
		calculateDamage(
			{ ...testWeapon, traits: [{ name: WeaponTraits.demolisher }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 0 } }
		)
	).toBe("0.11")
	expect(
		calculateDamage(
			{ ...testWeapon, dice: 3, traits: [{ name: WeaponTraits.demolisher }] },
			{ ...testTarget, unit_type: { type: UNIT_TYPE.structure, value: 0 } }
		)
	).toBe("0.33")
})

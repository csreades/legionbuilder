import { FACTION, FORMATION, SLOT_TYPE } from "@type/types"
import { supportFormationText } from "@data/formations/formationRules"

// ********************************************************************
// *********************** ASTARTES FORMATIONS ************************
// ********************************************************************

// 1000-1999
export const astartes: FORMATION[] = [
	{
		id: 1000,
		name: "Legion Demi-company",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [1000, 1002, 1001, 1001] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1009, 1001, 1010, 1010, 1002, 1002, 1003, 9000] },
			{ slot_type: SLOT_TYPE.choice, slot_id: [1004, 1008], text: "Up to one of the following" },
			{ slot_type: SLOT_TYPE.choice, slot_id: [1007, 1005, 1006], text: "Up to one of the following" },
		],
		rules: [
			{
				name: "Dedicated Transports",
				text: "Any Legiones Astartes Detachment within the Formation that contains only Infantry models may be upgraded with Legion Rhinos as Dedicated Transports.",
			},
			{
				name: "Heart of the Legion",
				text: "Compulsory Core Detachment slots in this Formation must be filled with Legion Tactical Detachments. All non-Infantry models within this Formation increase their Tactical Strength by 1 when contesting an Objective marker that an Infantry model within this Formation is also contesting.",
			},
		],
	},
	{
		id: 1001,
		name: "Legion Garrison Force",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [1000, 1002, 1001, 1009] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1009, 1009, 1001, 1007, 1002, 1002, 1008] },
			{ slot_type: SLOT_TYPE.choice, slot_id: [1006, 1007], text: "Up to one of the following" },
		],
		rules: [],
	},
	{
		id: 1002,
		name: "Legion Armoured Company",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [1015, 1005, 1005, 1006] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1004, 1005, 1005, 1006] },
			{ slot_type: SLOT_TYPE.choice, slot_id: [1008, 1006], text: "Up to one of the following" },
		],
		rules: [],
	},
	{
		id: 1003,
		name: "Legion Aerial Assault",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [1000, 1001, 1001, 1002] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1001, 1002, 1002, 1003, 1008, 1008, 9001, 9002] },
		],
		rules: [
			{
				name: "Dedicated Transports",
				text: "Any Legiones Astartes Detachment within a Legion Aerial Assault Formation can be upgraded with Legion Storm Eagles or Legion Thunderhawks as Dedicated Transports, at a cost of +85 points per Storm Eagle and +150 points per Legion Thunderhawk",
			},
			{
				name: "Aerial Assault",
				text: "All Detachments within the Formation that do not have the Flyer special rule must begin the game Embarked upon a Transport with the Flyer special rule",
			},
		],
	},
	{
		id: 1004,
		name: "Legion Sky-hunter Phalanx",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [9006, 9006, 9006, 9006] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1004, 1004, 1008, 1003] },
		],
		rules: [
			{
				name: "Rapid Reaction Force",
				text: "Compulsory Vanguard Detachment slots in this Formation must be filled with Legion Scimitar Jetbike Squadron, Legion Land Speeder Squadron or Legion Javelin Squadron Detachments",
			},
			{
				name: "Swift Assault",
				text: "All Legion Scimitar Jetbike Squadron, Legion Land Speeder Squadron or Legion Javelin Squadron in this Formation gain the Outflank special rule",
			},
		],
	},
	{
		id: 1005,
		name: "Legion Drop Pod Assault",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [1000, 1001, 1001, 1002] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1001, 1001, 1002, 1002, 1008, 9007, 9008] },
		],
		rules: [
			{
				name: "Dedicated Transports",
				text: "All Legiones Astartes Detachments within the Formation that contain only Infantry models (excluding models with the Deep Strike special rule) must be upgraded with Legion Drop Pods as Dedicated Transports, and all Legiones Astartes Detachments within the Formation that contain only Walker models (excluding models with the Deep Strike special rule) must be upgraded with Dreadnought Drop Pods as Dedicated Transports.",
			},
		],
	},
	{
		id: 1006,
		name: "Legion Heavy Assault Spearhead",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [9010, 9010, 9011, 9011] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1005, 1005, 1008, 1006, 1006, 9012, 9013] },
		],
		rules: [
			{
				name: "Heavy Assault",
				text: "At least two Compulsory Support Detachments slots in this Formation mus be filled with Legion Terminator Detachments. Any remaining Compulsory Support Detachment slots in this Formation must be filled with Legion Terminator Detachments, Legion Contemptor Dreadnought Talons or Leviathan Siege Dreadnought Detachments.",
			},
			{
				name: "Dedicated Transports",
				text: "All Legiones Astartes Detachments within this Formation that contain only Infantry models must be upgraded with Legion Spartans or Legion Land Raiders as Dedicated Transports.",
			},
		],
	},
	{
		id: 1007,
		name: "Legion Subterranean Assault",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [1000, 1001, 1001, 1002] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1001, 1001, 1002, 1002, 9014] },
		],
		rules: [
			{
				name: "Dedicated Transports",
				text: "All Legiones Astartes Detachments within this Formation that contain only Infantry models (excluding models with the Deep Strike special rule) must be upgraded with Legion Termites as Dedicated Transports.",
			},
			{
				name: "Subterranean Assault",
				text: 'When a Detachment from this Formation that has been upgraded with Legion Termites as Dedicated Transports Deep Strikes, after placing and scattering the initial model, roll a D6 for each enemy Detachment with a Scale of 2 or less that is within 6" of that initial model. On a 5+, that enemy Detachment suffers the effects of the Quake trait as if a hit had been scored against it by a weapon with that trait.',
			},
		],
	},
	{
		id: 1008,
		name: "Brethren of Iron",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [1000, 1011, 1011] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1011, 1012, 1013, 1013] },
			{
				slot_type: SLOT_TYPE.choice,
				slot_id: [1013, 1014, 1014],
				text: "ONE Support slot or TWO Vanguard slots",
			},
		],
		rules: [
			supportFormationText(FACTION.astartes),
			{
				name: "Forge Lord",
				text: `HQ Detachment slots in this Support Formation must be filled by HQ Detachments chosen from the Legiones Astartes Army List`,
			},
			{
				text: `Support, Vanguard and Bastion Detachment slots in this Support Formation must be filled with Detachments from the Mechanicum Taghmata Army List. Detachments taken from the Mechanicum Taghmata Army List in this way must have the Cybernetica Cortex (X) special rule`,
			},
			{
				text: "Core Detachment slots in this Support Formation may be filled by Core Detachments chosen from the Legiones Astartes Army List or with Thallax Cohort Detachments chosen from the Mechanicum Taghmata Army List. HQ and Core Detachments chosen from the Legiones Astartes Army List in this Support Formation gain the Cortex Controller special rule",
			},
			{
				text: `Detachments from the Mechanicum Taghmata Army List in this Support Formation do not gain the Legiones Astartes special rule selected for this Support Formation, but instead gain the Line special rule while that Detachment is within 8" of a Legiones Astartes Detachment from the same Support Formation`,
			},
		],
	},
	{
		id: 1009,
		name: "Legion Saturnine Heavy Assault Cadre",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [1016, 1017, 1017] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1017, 1017, 1018, 1018] },
		],
		rules: [
			{
				name: "Saturnine Assault",
				text: "HQ Detachment slots in this Formation must be filled with Legion Saturnine Command Detachments, Support Detachment slots in this Formation must be filled with Legion Saturnine Terminator Detachments and Bastion Detachment slots in this Formation must be filled with Legion Saturnine Dreadnought Detachments.",
			},
			{
				name: "Saturnine Teleportation Transponder",
				text: "Legion Saturnine Command Detachments and Legion Terminator Detachments from this Formation have the Deep Strike special rule. All Detachments in this Formation with the Deep Strike special rule must Deep Strike in the same Movement phase as the Detachment that includes the Legion Saturnine Command Detachment",
			},
			{
				text: 'During that Movement phase, the Detachment that includes the Legion Saturnine Command Detachment must be the first from this Formation to Deep Strike, and all other Detachments from this Formation that Deep Strike must have their first model placed within 6" of the Legion Saturnine Command Squad model from that Detachment. If the Saturnine Command Squad model would be destroyed before all such Deep Strikes have been completed, leave the model in place until all such Deep Strikes have been completed, and then remove the model from the battlefield.',
			},
		],
	},
	{
		id: 1010,
		name: "Legion Super-heavy Spearhead",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [1006, 1006, 1006] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1006, 1006, 1008] },
		],
		rules: [
			{
				name: "Unstoppable Advance",
				text: "While a Heavy Armour Detachment from this Formation has two or more models, models in that unit have the following additional weapon:",
			},
			{
				name: "Crushing treads",
				text: 'Range: "-", Dice: "-", To Hit: "-", AP: "-1", Traits: "Rend, Wrecker (1)"',
			},
		],
	},
	{
		id: 1011,
		name: "Legion Aegis Defence Strongpoint",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [1000, 1001, 1019, 1019] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [1002, 1007, 1019, 1019] },
		],
		rules: [
			{
				name: "Defensive Strongpoint",
				text: "Bastion Detachment slots in this Formation must be filled with Araknae Weapons Platform Battery Detachments or Legion Tarantula Battery Detachments. Detachments in this Formation may not be deployed using the Infiltrate special rule.",
			},
			{
				name: "Overlapping Fire",
				text: "Weapons that Araknae Weapons Platform models in this Formation have gain the Point Defence trait",
			},
		],
	},
]

import { ALLEGIANCE, FACTION, FORMATION, FORMATION_RULES, SLOT_TYPE, SUBFACTION_TYPE } from "@type/types"

const iconicFormation: FORMATION_RULES = {
	name: "Iconic Formation",
	text: "Each Iconic Formation consists of two elements: Standard Detachments and Expanded Detachments. When an Iconic Formation is added to your Army Roster, you can either add only the Standard Detachments for the points cost listed, or the Standard Detachments and the Expanded Detachments, paying the additional points cost for the Expanded Detachments. A player may choose not to include every Detachment listed under the Expanded Detachments section, but the points cost is not reduced if they do so.",
}

// 7000-7999

// CONTENTS //

// 7000 - Astartes - Seeker-Killer Clave Ultor
// 7001 - Astartes - Proioxis Macro-Assault Wing
// 7002 - Astartes - Harrow Group Arcadus
// 7003 - Solar - Tallarn Reborn Carmine Ambush Tercio
// 7004 - Solar - Galibed Oathsworn Thyreos Siege Breaker Company
// 7005 - Mechanicum - Demi-manaple Aeterna
// 7006 - Mechanicum - Exsomnis-tertia Cybernetica Cohort
// 7007 - DarkMech - Sibilans Taghma
// 7008 - Astartes - Death Guard Reaping Host
// 7009 - Astartes - White Scars Chogorian Warband
// 7010 - Astartes - Legion Tactical Strike Force
// 7011 - Astartes - Legion Stonebreaker Siege Force
// 7012 - Astartes - Legion Speartip Assault
// 7013 - Solar - Solar Pattern Sub-Cohort
// 7014 - Solar - Ultima Pattern Sub-Cohort
// 7015 - Solar - Mechanised Pattern Sub-Cohort
// 7016 - Solar - Cthonian Headhunters Sub-Cohort
// 7017 - Solar - Theta-Garmon Deathless Sub-Cohort
export const legends: FORMATION[] = [
	{
		id: 7000,
		name: "Seeker-Killer Clave Ultor",
		faction: FACTION.astartes,
		subfaction: SUBFACTION_TYPE.ironHands,
		allegiance: ALLEGIANCE.loyalist,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7000, 7001, 7002] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7000, 7002] },
		],
		rules: [
			iconicFormation,
			{
				name: "Sons of Ferrus Manus",
				text: "This Formation must be from the Iron Hands Legion and can only be included in an Army with the Loyalist Allegiance. In addition, an Army can only include one Iron Hands Seeker-Killer Clave Ultor Formation.",
			},
			{
				name: "Seeker-killers",
				text: "Detachments from this Formation have the Macro-extinction Targeting Protocols special rule.",
			},
		],
		legend: true,
		points: { compulsory: 410, optional: 260 },
	},
	{
		id: 7001,
		name: "Proioxis Macro-Assault Wing",
		faction: FACTION.astartes,
		subfaction: SUBFACTION_TYPE.ironWar,
		allegiance: ALLEGIANCE.traitor,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7003, 7004, 7003, 7004] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7003, 7004, 7005] },
		],
		rules: [
			iconicFormation,
			{
				name: "Sons of Perturabo",
				text: "This Formation must be from the Iron Warriors Legion and can only be included in an Army with the Traitor Allegiance. In addition, an Army can only include one Iron Warriors Proioxis Macro-Assault Wing Formation",
			},
			{
				name: "Hammerblow Assault",
				text: "Legion Terminator models from this Formation increase their CAF by 2 during any round in which they Disembarked form a Spartan model form this Formation.",
			},
		],
		legend: true,
		points: { compulsory: 340, optional: 410 },
	},
	{
		id: 7002,
		name: "Harrow Group Arcadus",
		faction: FACTION.astartes,
		subfaction: SUBFACTION_TYPE.alphaLegion,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7006, 7006, 7007, 7008] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7009, 7007, 7008] },
		],
		rules: [
			iconicFormation,
			{
				name: "Protean Instrument",
				text: "This Formation must be from the Alpha Legion. In addition, an Army can only include one Alpha Legion Harrow Group Arcadus Formation.",
			},
			{
				name: "Obfuscation Protocols",
				text: "Detachments from this Formation have the Outflank and Scout special rules.",
			},
		],
		legend: true,
		points: { compulsory: 495, optional: 300 },
	},
	{
		id: 7003,
		name: "Tallarn Reborn Carmine Ambush Tercio",
		faction: FACTION.solar,
		subfaction: null,
		allegiance: ALLEGIANCE.loyalist,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7010, 7011, 7012] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7013, 7013] },
		],
		rules: [
			iconicFormation,
			{
				name: "Defenders of Tallarn",
				text: "This formation can only be included in an Army with the Loyalist Allegiance. In addition, an Army can only include one Tallarn Reborn Carmine Ambush Tercio.",
			},
			{
				name: "Ambush Tercio",
				text: "Detachments from this Formation have the Forward Deployment and Scout special rules",
			},
		],
		legend: true,
		points: { compulsory: 465, optional: 110 },
	},
	{
		id: 7004,
		name: "Galibed Oathsworn Thyreos Siege Breaker Company",
		faction: FACTION.solar,
		subfaction: null,
		allegiance: ALLEGIANCE.traitor,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7014, 7015, 7016] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7014, 7015] },
		],
		rules: [
			iconicFormation,
			{
				name: "Despoilers of Tallarn",
				text: "This formation can only be included in an Army with the Traitor Allegiance. In addition, an Army can only include one Galibed Oathsworn Thyreos Siege Breaker Company",
			},
			{
				name: "Thyreos Doctrine",
				text: `While an Auxilia Medusa Battery or Auxilia Basilik Battery Detachment from this Formation is within 2" of an Auxilia Stormsword Squadron from this Formation, each time a hit is scored against that Auxilia Medusa Battery or Auxilia Basilisk Battery Detachment, unless that hit was from a weapon with the Barrage or Heavy Barrage trait, you can allocated that hit to a Stormsword model from this Formation that is also visible to the firing Detachment.`,
			},
		],
		legend: true,
		points: { compulsory: 480, optional: 370 },
	},
	{
		id: 7005,
		name: "Demi-maniple Aeterna",
		faction: FACTION.collegiaTitanica,
		subfaction: null,
		allegiance: ALLEGIANCE.loyalist,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7017, 7018, 7019] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7020, 7021, 7022] },
		],
		rules: [
			iconicFormation,
			{
				name: "Defenders of Magma City",
				text: "This Formation can only be included in an Army with the Loyalist Allegiance. In addition, an Army can only include one Demi-maniple Aeterna.",
			},
			{
				name: "Children of the Storm",
				text: "Once per game, when a Titan from this Formation finishes its activation during the Combat phase, it may immediately fire one of its weapons again.",
			},
		],
		legend: true,
		points: { compulsory: 780, optional: 960 },
	},
	{
		id: 7006,
		name: "Exsomnis-tertia Cybernetica Cohort",
		faction: FACTION.mechanicum,
		subfaction: null,
		allegiance: ALLEGIANCE.loyalist,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7023, 7024, 7025, 7025, 7026] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7027, 7025, 7025, 7024, 7026, 7028] },
		],
		rules: [
			iconicFormation,
			{
				name: "Defenders of Magma City",
				text: "This Formation can only be included in an Army with the Loyalist Allegiance",
			},
			{
				name: "Adaptive Protocols",
				text: "When a Detachment from this Formation that has the Cybernetica Cortex (X) special rule is activated, its Order may be replaced with a new Order. The new Order must be the same Order as one issued to a friendly Detachment from this Formation that has the Cybernetica Cortex (X) special rule and is within 6\" of the activated Detachment. The new Order can be an Order other than those show in the activated Detachment's Cybernetica Cortex (X) special rule, even oif the activated Detachment is not within range of a Cyber Controller.",
			},
		],
		legend: true,
		points: { compulsory: 610, optional: 890 },
	},
	{
		id: 7007,
		name: "Sibilans Taghma",
		faction: FACTION.darkMechanicum,
		subfaction: null,
		allegiance: ALLEGIANCE.traitor,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7029, 7030, 7030, 7031, 7032, 7033] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7034, 7032, 7032, 7031] },
		],
		rules: [
			iconicFormation,
			{
				name: "Servants of Kelbor-Hal",
				text: "This Formation can only be included in an Army with the Traitor Allegiance",
			},
			{
				name: "Protocol - Scourge",
				text: `While a Detachment from this Formation with the Networked Anima special rule is within 8" of a model with the Noosphere Controller special rule from this Formation, all models in that Detachment increase the range of their weapons by 4"`,
			},
		],
		legend: true,
		points: { compulsory: 900, optional: 700 },
	},
	{
		id: 7008,
		name: "Death Guard Reaping Host",
		faction: FACTION.astartes,
		subfaction: SUBFACTION_TYPE.deathGuard,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7035, 7036, 7037, 7038] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [70390, 7039, 7039, 7037, 7038] },
		],
		rules: [
			iconicFormation,
			{
				name: "Sons of the Pale King",
				text: "This Formation must be from the Death Guard Legion.",
			},
			{
				name: "Shattering Volleys",
				text: "Missile Launchers models in this Formation are equipped with gain the Demolisher special rule while their Detachment is not Garrisoned within a Structure.",
			},
		],
		legend: true,
		points: { compulsory: 285, optional: 350 },
	},
	{
		id: 7009,
		name: "White Scars Chogorian Warband",
		faction: FACTION.astartes,
		subfaction: SUBFACTION_TYPE.whiteScars,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7040, 7040, 7041, 7042] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7043, 7044, 7045, 7046] },
		],
		rules: [
			iconicFormation,
			{ name: "Sons of the Khan", text: "This Formation must be from the White Scars Legion." },
			{
				name: "Ride the Wind",
				text: "Standard Detachments in this Formation gain the Forward Deployment special rule.",
			},
		],
		legend: true,
		points: { compulsory: 305, optional: 265 },
	},
	{
		id: 7010,
		name: "Legion Tactical Strike Force",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7047, 7048, 7044, 7045, 7044, 7045] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7049, 7052, 7050, 7053, 7051] },
		],
		rules: [
			iconicFormation,
			{
				name: "Officer of the Line",
				text: "The Command Squad model in this Formation can use the Master Tactician special rule twice when it is activated, but it if does, both Detachments selected to have their order replaced must be from this Formation",
			},
			{
				name: "Backbone of the Legion",
				text: "Legion Tactical Detachments from this Formation have the Line special rule.",
			},
		],
		legend: true,
		points: { compulsory: 230, optional: 140 },
	},
	{
		id: 7011,
		name: "Legion Stonebreaker Siege Force",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7054, 70540, 7044, 7055, 7056] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7057, 7058, 7059, 7056] },
		],
		rules: [
			iconicFormation,
			{
				name: "Shattering Barrage",
				text: "When making a Fight roll for an enemy model that is Garrisoned within a Structure that is in a Fight against an Infantry model from this Formation, the controlling player does not gain the Structure Bonus to that model's CAF if that Structure has lost any wounds",
			},
		],
		legend: true,
		points: { compulsory: 370, optional: 520 },
	},
	{
		id: 7012,
		name: "Legion Speartip Assault",
		faction: FACTION.astartes,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7060, 70600, 7061, 7062, 7061, 7062, 7063] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7064, 7066, 7065, 7066, 7063] },
		],
		rules: [
			iconicFormation,
			{
				name: "Tip of the Spear",
				text: "All Detachments in this Formation must start the battle deployed within their Dedicated Transports. WHen a Detachment from this Formation Deep Strikes, after placing the first model, that model does not Scatter",
			},
		],
		legend: true,
		points: { compulsory: 230, optional: 205 },
	},
	{
		id: 7013,
		name: "Solar Pattern Sub-Cohort",
		faction: FACTION.solar,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7067, 7068, 7069, 7070, 7069, 7070] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7067, 7068, 7071, 7070, 7069, 7070] },
		],
		rules: [
			iconicFormation,
			{
				name: "Elite Commander",
				text: "Legate Commander Detachments from the Expanded Detachments in this Formation do not count towards the maximum number permitted in an Army.",
			},
		],
		legend: true,
		points: { compulsory: 335, optional: 385 },
	},
	{
		id: 7014,
		name: "Ultima Pattern Sub-Cohort",
		faction: FACTION.solar,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7072, 7073, 7074, 7074, 7074] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7073, 7075, 7075, 7075] },
		],
		rules: [
			iconicFormation,
			{
				name: "Volley Fire",
				text: "While an Auxilia Lasrile Tercio Detachment in this Formation contains 5 or more Auxiliaries models, Auxilia lasrifles that models in that Detachment are equipped with have the Rapid Fire rule",
			},
		],
		legend: true,
		points: { compulsory: 300, optional: 300 },
	},
	{
		id: 7015,
		name: "Mechanised Pattern Sub-Cohort",
		faction: FACTION.solar,
		subfaction: null,
		allegiance: null,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7076, 7077, 7078] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7079, 7080, 7081] },
		],
		rules: [
			iconicFormation,
			{
				name: "Mechanised Tercios",
				text: "While a Detachment from this Formation contains a Tank Commander model, that Detachment has the Nimble and Steadfast special rules.",
			},
		],
		legend: true,
		points: { compulsory: 410, optional: 410 },
	},
	{
		id: 7016,
		name: "Cthonian Headhunters Sub-Cohort",
		faction: FACTION.solar,
		subfaction: null,
		allegiance: ALLEGIANCE.traitor,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7082, 7083, 7084, 7085, 7086] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7082, 7083, 7084, 7085, 7087] },
		],
		rules: [
			iconicFormation,
			{
				name: "Favoured of the Warmaster",
				text: "This Formation can only be included in an Army with the Traitor Allegiance",
			},
			{
				name: "Overwhelming Aggression",
				text: "Infantry and Walker Detachments in this Formation gain the Furious Charge special rule",
			},
		],
		legend: true,
		points: { compulsory: 270, optional: 330 },
	},
	{
		id: 7017,
		name: "Theta-Garmon Deathless Sub-Cohort",
		faction: FACTION.solar,
		subfaction: null,
		allegiance: ALLEGIANCE.loyalist,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7088, 7089, 7089, 7089, 7090] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7091, 7093, 7092, 7092] },
		],
		rules: [
			iconicFormation,
			{
				name: "Defenders of Beta-Garmon",
				text: "This Formation can only be included in an Army with the Loyalist Allegiance.",
			},
			{
				name: "Deathless",
				text: 'Detachments in this Formation gain the Feel No Pain special rule while any models from that Detachment are within 10" of any enemy Deatchments in an Army with the Traitor Allegiance.',
			},
		],
		legend: true,
		points: { compulsory: 385, optional: 360 },
	},
	{
		id: 7018,
		name: "Saturnine Excubitor Cadre",
		faction: FACTION.astartes,
		subfaction: SUBFACTION_TYPE.salamanders,
		allegiance: ALLEGIANCE.loyalist,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7094, 7095, 7095, 7096] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7095, 7097, 7096] },
		],
		rules: [
			iconicFormation,
			{
				name: "Heavy Assault Cadre",
				text: "When a Saturnine Terminator model from this Formation Disembarks from a Mastodon model from this Formation, weapons that Saturnine Terminator model has gain the Shred trait until the end of the round.",
			},
			{
				name: "Sons of Vulkan",
				text: "This Formation must be from the Salamanders Legion and can only be included in an Army with the Loyalist Allegiance. In addition, an Army can only include one Salamanders Saturnine Heavy Assault Cadre Formation.",
			},
		],
		legend: true,
		points: { compulsory: 570, optional: 495 },
	},
	{
		id: 7019,
		name: "Iron Warriors Obliteration Century",
		faction: FACTION.astartes,
		subfaction: SUBFACTION_TYPE.ironWar,
		allegiance: ALLEGIANCE.traitor,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7098, 7099, 7100] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7101, 7102, 7103] },
		],
		rules: [
			iconicFormation,
			{
				name: "Overwhelming Destruction",
				text: "If a Morale check would be made for an enemy Detachment as a result of being fired at by a Detachment from this Formation, the controlling player subtracts 1 from the result of that Morale check.",
			},
			{
				name: "Breakers of Legions",
				text: "This Formation must be from the Iron Warriors Legion and can only be included in an Army with the Traitor Allegiance.",
			},
		],
		legend: true,
		points: { compulsory: 620, optional: 790 },
	},
	{
		id: 7020,
		name: "The Sacramentii Foehammers",
		faction: FACTION.solar,
		subfaction: null,
		allegiance: ALLEGIANCE.loyalist,
		formation_slots: [
			{ slot_type: SLOT_TYPE.compulsory, slot_id: [7104, 7105, 7106] },
			{ slot_type: SLOT_TYPE.optional, slot_id: [7107, 7108, 7109] },
		],
		rules: [
			iconicFormation,
			{
				name: "Defenders of the Legion",
				text: "This Formation can only be included in an Army with the Loyalist Allegiance.",
			},
			{
				name: "Armoured Charge",
				text: "If a Detachment in this Formation has a Charge Order, until the end of that round it has the following additional weapon:",
			},
			{
				name: "Crushing bulk",
				text: 'Range: "-", Dice: "-", To Hit: "-", AP: "-", Trait: "Rend',
			},
		],
		legend: true,
		points: { compulsory: 675, optional: 490 },
	},
]

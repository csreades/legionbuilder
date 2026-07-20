import { Styles } from "@react-pdf/renderer"

// Green "dataslate" theme approximating the printed card look, tuned so up to 9
// cards fit a landscape A4 while staying readable.
const DARK = "#0b3d2c" // header / name bars
const MID = "#15503a" // sub bars, table headers
const LIGHT = "#eef3ef" // card background
const ALT = "#dce6df" // alternating table row
const RULE = "#e5ede7" // special-rule / notes background
const CREAM = "#f2f7f3"
const INK = "#12241c"

export const cardPdfStyles: Styles = {
	page: {
		backgroundColor: "#ffffff",
		padding: 16,
		fontSize: 6.5,
		color: INK,
		fontFamily: "Helvetica",
	},

	// Formation header bar
	formationHeader: {
		backgroundColor: DARK,
		color: CREAM,
		borderRadius: 4,
		padding: 6,
		marginBottom: 6,
	},
	formationTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
	formationTitle: { fontSize: 12, fontFamily: "Helvetica-Bold" },
	formationPoints: { fontSize: 10, fontFamily: "Helvetica-Bold" },
	formationStrength: { fontSize: 9, fontFamily: "Helvetica-Bold" },
	formationRule: { fontSize: 6.5, marginTop: 3, color: CREAM },

	// Card layout: 3 columns that flow down and paginate cleanly (avoids the big
	// gaps flex-wrap leaves when a tall row won't fit at the bottom of a page).
	columns: { flexDirection: "row" },
	column: { width: "33.333%" },
	cardWrap: { padding: 3 },
	card: {
		border: `1pt solid ${DARK}`,
		borderRadius: 5,
		backgroundColor: LIGHT,
		overflow: "hidden",
	},

	// Card header
	cardHeader: {
		backgroundColor: DARK,
		color: CREAM,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 3,
		paddingHorizontal: 5,
	},
	cardName: { fontSize: 8.5, fontFamily: "Helvetica-Bold" },
	cardPoints: { fontSize: 8, fontFamily: "Helvetica-Bold" },

	typeBar: {
		backgroundColor: MID,
		color: CREAM,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 2,
		paddingHorizontal: 5,
		fontFamily: "Helvetica-Bold",
	},

	sectionBar: {
		backgroundColor: MID,
		color: CREAM,
		paddingVertical: 2,
		paddingHorizontal: 5,
		fontFamily: "Helvetica-Bold",
		marginTop: 2,
	},

	// Tables
	tHeader: { flexDirection: "row", backgroundColor: MID, color: CREAM, fontFamily: "Helvetica-Bold" },
	tRow: { flexDirection: "row", backgroundColor: LIGHT },
	tRowAlt: { flexDirection: "row", backgroundColor: ALT },
	cell: { paddingVertical: 1.5, paddingHorizontal: 3 },
	cellCenter: { paddingVertical: 1.5, paddingHorizontal: 2, textAlign: "center" },

	greyText: { color: "#9aa39d" },

	rules: { backgroundColor: RULE, paddingVertical: 2, paddingHorizontal: 5 },
	notes: { backgroundColor: RULE, paddingVertical: 2, paddingHorizontal: 5, fontFamily: "Helvetica-Bold" },

	// Casualty tick boxes: one outer box per model, split into wound-sized inner boxes
	trackerRow: { flexDirection: "row" },
	trackerCol: { flex: 1 },
	casualties: { paddingVertical: 3, paddingHorizontal: 5 },
	casualtyLabel: { fontFamily: "Helvetica-Bold", marginBottom: 1 },
	casualtyUnit: { marginBottom: 1 },
	casualtyUnitName: { fontFamily: "Helvetica-Bold", marginBottom: 1 },
	boxRow: { flexDirection: "row", flexWrap: "wrap" },
	modelBox: {
		flexDirection: "row",
		border: `0.75pt solid ${DARK}`,
		borderRadius: 1.5,
		padding: 1,
		marginRight: 2,
		marginBottom: 2,
	},
	woundBox: { width: 7, height: 7, border: `0.5pt solid ${DARK}`, borderRadius: 0.5, marginRight: 1 },
}

export const CARD_COLORS = { DARK, MID, LIGHT, ALT, CREAM, INK }

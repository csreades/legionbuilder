import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Legion Builder",
		short_name: "Legion Builder",
		description: "List builder and play aid for Legions Imperialis",
		start_url: "/lists",
		scope: "/",
		display: "standalone",
		background_color: "#0b3d2c",
		theme_color: "#0b3d2c",
		icons: [
			{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
			{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
			{ src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
		],
	}
}

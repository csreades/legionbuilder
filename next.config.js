/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				// Always fetch a fresh service worker so updates roll out promptly.
				source: "/sw.js",
				headers: [
					{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
					{ key: "Service-Worker-Allowed", value: "/" },
				],
			},
		]
	},
}

module.exports = nextConfig

// Legion Builder service worker — offline-capable app shell. No push/notifications.
const VERSION = "lb-v1"
const STATIC = `${VERSION}-static`
const RUNTIME = `${VERSION}-runtime`
const PRECACHE = ["/", "/lists", "/lists/cards", "/reference"]

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(RUNTIME)
			.then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
			.then(() => self.skipWaiting())
	)
})

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	)
})

// Only cache clean same-origin successes (never an auth redirect or error page).
const cacheable = (res) => res && res.ok && res.type === "basic" && !res.redirected

const cacheFirst = async (req) => {
	const hit = await caches.match(req)
	if (hit) return hit
	const res = await fetch(req)
	if (cacheable(res)) (await caches.open(STATIC)).put(req, res.clone())
	return res
}

const networkFirst = async (req) => {
	try {
		const res = await fetch(req)
		if (cacheable(res)) (await caches.open(RUNTIME)).put(req, res.clone())
		return res
	} catch (err) {
		const hit = await caches.match(req)
		if (hit) return hit
		if (req.mode === "navigate") {
			const shell = (await caches.match("/lists")) || (await caches.match("/"))
			if (shell) return shell
		}
		throw err
	}
}

self.addEventListener("fetch", (event) => {
	const req = event.request
	const url = new URL(req.url)
	if (req.method !== "GET" || url.origin !== self.location.origin) return
	if (url.pathname.startsWith("/api/auth/")) return // always live
	if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/_next/image"))
		event.respondWith(cacheFirst(req))
	else event.respondWith(networkFirst(req))
})

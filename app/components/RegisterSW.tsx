"use client"

import { useEffect } from "react"

// Registers the service worker (production only; browsers require HTTPS or localhost).
const RegisterSW = () => {
	useEffect(() => {
		if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return
		navigator.serviceWorker.register("/sw.js").catch(() => {})
	}, [])
	return null
}

export default RegisterSW

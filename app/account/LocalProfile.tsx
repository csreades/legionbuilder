"use client"

import { useRouter } from "next/navigation"
import useAuthState from "@/app/Auth"
import Main from "@components/Main"

export const localLogout = async () => {
	await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
	// Drop this user's cached pages/lists so the next person on the device can't see them offline.
	if (typeof caches !== "undefined") {
		const keys = await caches.keys().catch(() => [] as string[])
		await Promise.all(keys.filter((k) => k.includes("runtime")).map((k) => caches.delete(k)))
	}
}

// Profile page for local accounts: who you are + log out.
const LocalProfile = () => {
	const username = useAuthState((state) => state.uid)
	const reset = useAuthState((state) => state.reset)
	const router = useRouter()

	const logout = async () => {
		await localLogout()
		reset()
		router.push("/")
	}

	return (
		<Main className="flex flex-col items-center gap-4 p-4">
			<h2 className="text-xl font-graduate">{username ? `Signed in as ${username}` : "Not signed in"}</h2>
			{username ? (
				<button
					onClick={logout}
					className="px-4 py-2 text-xl hover:text-tertiary-700 active:text-tertiary-700 border-4 rounded-full font-graduate">
					Log out
				</button>
			) : null}
		</Main>
	)
}

export default LocalProfile

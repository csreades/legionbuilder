"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useAuthState from "@/app/Auth"
import Main from "@components/Main"
import { BreadCrumbs, Crumb } from "@components/BreadCrumbs"

// Username/password sign-in and registration against this app's own server.
const LocalAuthForm = ({ mode }: { mode: "login" | "register" }) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [confirm, setConfirm] = useState("")
	const [error, setError] = useState("")
	const [busy, setBusy] = useState(false)
	const saveSession = useAuthState((state) => state.saveSession)
	const router = useRouter()
	const registering = mode === "register"

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (registering && password !== confirm) return setError("Passwords don't match")
		setBusy(true)
		setError("")
		try {
			const res = await fetch(`/api/auth/${mode}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			})
			const data = await res.json()
			if (!res.ok) return setError(data.error || "Something went wrong")
			saveSession(data.username)
			router.push("/lists")
		} catch {
			setError("Couldn't reach the server")
		} finally {
			setBusy(false)
		}
	}

	const field = (label: string, id: string, value: string, set: (v: string) => void, type = "text") => (
		<div className="flex items-center w-full">
			<label htmlFor={id} className="font-graduate w-1/3 sm:w-1/4">
				{label}
			</label>
			<input
				id={id}
				type={type}
				value={value}
				onChange={(e) => set(e.target.value)}
				autoComplete={type === "password" ? (registering ? "new-password" : "current-password") : "username"}
				autoCapitalize="none"
				className="text-secondary-200 bg-secondary-700 w-2/3 sm:w-3/4 p-1 px-2"
				required
			/>
		</div>
	)

	return (
		<Main className="flex flex-col gap-6 items-center">
			<section className="flex flex-col gap-8 p-4 w-full lg:w-1/2">
				<BreadCrumbs>
					<Crumb href={`/account/${mode}`}>{registering ? "Register" : "Login"}</Crumb>
				</BreadCrumbs>
				{error ? <div className="text-red-500 px-4">{error}</div> : null}
				<form onSubmit={handleSubmit} className="flex flex-col gap-6 items-start">
					{field("Username", "username", username, setUsername)}
					{field("Password", "password", password, setPassword, "password")}
					{registering ? field("Confirm", "confirm", confirm, setConfirm, "password") : null}
					<button
						type="submit"
						disabled={busy}
						className="bg-primary-500 clip-path-halfagon-sm py-1 px-4 text-primary-100 font-semibold font-graduate disabled:opacity-50">
						{registering ? "Create account" : "Login"}
					</button>
				</form>
				<p className="p-4 bg-secondary-800 text-secondary-300 clip-path-octagon-md italic">
					{registering ? (
						<>
							Already have an account?{" "}
							<Link href="/account/login" className="text-primary-500 hover:text-primary-100">
								Log in
							</Link>
							.
						</>
					) : (
						<>
							No account yet?{" "}
							<Link href="/account/register" className="text-primary-500 hover:text-primary-100">
								Register
							</Link>
							. Forgotten your password? Ask the site admin to reset it.
						</>
					)}
				</p>
			</section>
		</Main>
	)
}

export default LocalAuthForm

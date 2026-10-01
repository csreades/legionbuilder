"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, getAuth, User } from "firebase/auth"
import useAuthState from "@/app/Auth"
import { LOCAL_MODE } from "@/app/localMode"
import firebase_app from "../config"

// In local mode we never touch Firebase Auth.
const auth = LOCAL_MODE ? null : getAuth(firebase_app)

export const AuthContext = createContext<{ user: User | null }>({ user: null })

export const useAuthContext = () => useContext(AuthContext)

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const saveSession = useAuthState((state) => state.saveSession)
	const reset = useAuthState((state) => state.reset)

	useEffect(() => {
		if (LOCAL_MODE) {
			// Username/password accounts on our own server; ask it who's signed in.
			fetch("/api/auth/me", { cache: "no-store" })
				.then((res) => res.json())
				.then(({ username }) => (username ? saveSession(username) : reset()))
				.catch(() => {})
			return
		}
		const unsubscribe = onAuthStateChanged(auth!, (user) => {
			if (user) {
				setUser(user)
				saveSession(user.uid)
			} else {
				setUser(null)
			}
		})
		return () => unsubscribe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export default AuthContextProvider

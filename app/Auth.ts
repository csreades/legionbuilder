import { createJSONStorage } from "zustand/middleware"
import createPersistedStore from "@/app/utils/persistedStore"
import { LOCAL_MODE } from "@/app/localMode"

interface AuthState {
	uid: string | null
	saveSession: (uid: string) => void
	reset: () => void
	authenticated: boolean
}

const useAuthState = createPersistedStore(
	(set: any): AuthState => ({
		uid: null,
		saveSession: (uid: string) => set({ uid, authenticated: true }),
		reset: () => set({ uid: null, authenticated: false }),
		authenticated: false,
	}),
	{
		name: "auth",
		// Persist to localStorage in local mode so the session survives restarts.
		storage: createJSONStorage(() => (LOCAL_MODE ? localStorage : sessionStorage)),
	}
)

export default useAuthState

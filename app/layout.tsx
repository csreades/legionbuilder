import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/react"
import { ReactNode, Suspense } from "react"
import ATBG from "public/images/AT_bg.jpg"
import Image from "next/image"
import "./globals.css"
import "react-toastify/dist/ReactToastify.css"

import NavBar from "@components/navigation/NavBar"
import AuthContextProvider from "./firebase/auth/AuthContext"
import UserData from "@app/UserData"
import RegisterSW from "@components/RegisterSW"

export const metadata: Metadata = {
	title: "Legion Builder",
	description: "A List builder for Warhammer: The Horus Heresy - Legion Imperialis",
	applicationName: "Legion Builder",
	appleWebApp: { capable: true, title: "Legion Builder", statusBarStyle: "black-translucent" },
	icons: { apple: "/icons/apple-touch-icon.png" },
}

export const viewport: Viewport = {
	themeColor: "#0b3d2c",
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className="min-w-screen min-h-screen bg-secondary-900 bg-scroll text-secondary-100 flex flex-col items-center text-sm md:text-base">
				<div className="fixed w-screen h-screen">
					<Image src={ATBG} fill alt="background" className="z-0" style={{ objectFit: "cover" }} />
				</div>
				<RegisterSW />
				<AuthContextProvider>
					<Suspense>
						<UserData>
							<NavBar />
							{children}
						</UserData>
					</Suspense>
					<Analytics />
				</AuthContextProvider>
			</body>
		</html>
	)
}

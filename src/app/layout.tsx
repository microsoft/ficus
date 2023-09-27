import "./styles.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: "Ficus",
	description: "Ficus",
}

export interface RootLayoutProps {
	children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	)
}

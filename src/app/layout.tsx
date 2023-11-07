import "./styles.css"
import { Inter } from "next/font/google"
import Nav from "@/components/Nav"
import { ContentStack } from "@/components/ContentStack"

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
			<body className={inter.className}>
				<Nav />
				<main>
					<ContentStack>{children}</ContentStack>
				</main>
			</body>
		</html>
	)
}

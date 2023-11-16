import "./styles.css"
import Nav from "@/components/Nav"
import { ContentStack } from "@/components/ContentStack"

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
			<body>
				<Nav />
				<main>
					<ContentStack>{children}</ContentStack>
				</main>
			</body>
		</html>
	)
}

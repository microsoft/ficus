import "./styles.css"
import { FluentProvider, ficusTheme } from "@/components/fluentui"
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
				<FluentProvider theme={ficusTheme} style={{ backgroundColor: "unset" }}>
					<Nav />
					<main>
						<ContentStack>{children}</ContentStack>
					</main>
				</FluentProvider>
			</body>
		</html>
	)
}

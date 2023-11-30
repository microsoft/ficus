import "./styles.css"
import { FluentProvider, ficusTheme } from "@/components/fluentui"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
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
				<FluentProvider
					theme={ficusTheme}
					style={{
						backgroundColor: "unset",
						flex: "1",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Nav />
					<main>
						<ContentStack>{children}</ContentStack>
					</main>
					<Footer />
				</FluentProvider>
			</body>
		</html>
	)
}

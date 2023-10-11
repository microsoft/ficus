import type React from "react"
import styles from "./Nav.module.css"
import Link from "next/link"
import { Content, ContentStack } from "./ContentStack"

export interface NavProps {}

export function Nav(_props: NavProps) {
	return (
		<>
			<nav className={styles.root}>
				<ContentStack>
					<Content>
						<Link href="/" className={styles.logo}>
							Ficus
						</Link>
					</Content>
				</ContentStack>
			</nav>
			<div className={styles.under} />
		</>
	)
}
export default Nav

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
						<ul className={styles.horiz}>
							<li>
								<Link href="/" className={styles.logo}>
									Ficus
								</Link>
							</li>
							<li>
								<Link href="/settings">Settings</Link>
							</li>
							<li>
								<Link href="/help">Help</Link>
							</li>
						</ul>
					</Content>
				</ContentStack>
			</nav>
			<div className={styles.under} />
		</>
	)
}
export default Nav

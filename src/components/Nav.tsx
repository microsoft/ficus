"use client"

import type React from "react"
import styles from "./Nav.module.css"
import Link from "next/link"
import { Body1, Body1Stronger } from "@fluentui/react-components"

export interface NavProps {}

export function Nav(_props: NavProps) {
	return (
		<>
			<header className={styles.root}>
				<nav>
					<ul className={styles.horiz}>
						<li className={styles.logo}>
							<Link href="/">
								<Body1Stronger>Ficus</Body1Stronger>
							</Link>
						</li>
						<div className={styles.spacer}></div>
						<li className={styles.right}>
							<Link href="/help">
								<Body1>FAQ</Body1>
							</Link>
						</li>
					</ul>
				</nav>
			</header>
			<div className={styles.under} />
		</>
	)
}
export default Nav

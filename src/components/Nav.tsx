"use client"

import type React from "react"
import styles from "./Nav.module.css"
import Link from "next/link"
import { Subtitle2 } from "@fluentui/react-components"

export interface NavProps {}

export function Nav(_props: NavProps) {
	return (
		<>
			<header className={styles.root}>
				<nav>
					<ul className={styles.horiz}>
						<li className={styles.logo}>
							<Link href="/">
								<img src="/images/app/logo48.png" width={48} height={48} alt="" />
								<Subtitle2>Ficus</Subtitle2>
							</Link>
						</li>
						<div className={styles.spacer}></div>
						<li className={styles.right}>
							<Link href="/help">
								<Subtitle2 style={{ fontWeight: "unset" }}>FAQ</Subtitle2>
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

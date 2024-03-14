"use client"

import type React from "react"
import styles from "./Footer.module.css"
import Link from "next/link"

export interface FooterProps {}

export function Footer(_props: FooterProps) {
	return (
		<>
			<footer className={styles.root}>
				<ul className={styles.horiz}>
					<li>
						<Link href="/">Ficus</Link> by{" "}
						<a href="https://microsoft.design" target="_blank">
							Microsoft Design
						</a>
					</li>
					<li className={styles.spacer} aria-hidden="true"></li>
					<li>
						<a href="https://go.microsoft.com/fwlink/?LinkID=206977" target="_blank">
							Terms of use
						</a>
					</li>
					<li>
						<a href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank">
							Privacy
						</a>
					</li>
					<li>
						<a href="https://github.com/microsoft/ficus" target="_blank">
							GitHub
						</a>
					</li>
				</ul>
			</footer>
		</>
	)
}
export default Footer

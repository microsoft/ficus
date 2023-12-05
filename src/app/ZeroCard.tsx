"use client"

import React from "react"
import styles from "./ZeroCard.module.css"
import { Card, Subtitle1, LargeTitle } from "@fluentui/react-components"
import { LinkButton } from "@/components/LinkButton"
import SwatchGrid from "@/assets/swatchgrid.svg"
import Diff from "@/assets/diff.svg"

export function ZeroCard() {
	return (
		<Card size="large">
			<div className={styles.horizontal}>
				<SwatchGrid />
				<Subtitle1 align="center">Change variables in Figma</Subtitle1>
				<LargeTitle align="center" className={styles.notnarrow}>
					→
				</LargeTitle>
				<div className={styles.notnarrow}></div>
				<img src="/images/app/logo180.png" width={180} height={180} alt="" />
				<Subtitle1 align="center">Sync with Ficus</Subtitle1>
				<LargeTitle align="center" className={styles.notnarrow}>
					→
				</LargeTitle>
				<div className={styles.notnarrow}></div>
				<Diff />
				<Subtitle1 align="center">Review and merge tokens on GitHub</Subtitle1>
				<div className={styles.lastrow}>
					<LinkButton appearance="primary" href="/projects/add">
						Try it now
					</LinkButton>
				</div>
			</div>
		</Card>
	)
}
export default ZeroCard

"use client"

import React from "react"
import styles from "./ThumbnailStack.module.css"
import type { Project } from "@/projects"

export interface ThumbnailStackProps {
	project: Project
}

export function ThumbnailStack(props: ThumbnailStackProps) {
	return props.project.figma.metadata && Object.keys(props.project.figma.metadata).length ? (
		<div className={styles.root}>
			{Object.values(props.project.figma.metadata).map((metadata, index) => (
				<img key={index} className={styles.thumbnail} src={metadata.thumbnailUrl} alt={metadata.name} />
			))}
		</div>
	) : null
}
export default ThumbnailStack

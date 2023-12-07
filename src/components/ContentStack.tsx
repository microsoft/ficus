"use client"

import React from "react"
import styles from "./ContentStack.module.css"

export interface ContentProps {
	children: React.ReactNode | React.ReactNode[]
}

export function ContentStack(props: ContentProps) {
	return <div>{props.children}</div>
}

export function Content(props: ContentProps) {
	return <div className={styles.content}>{props.children}</div>
}

"use client"

import React from "react"
import styles from "./page.module.css"
import { Content } from "@/components/ContentStack"
import { useCreatePullRequest } from "@/operations/createPullRequest"

export default function Status() {
	const [createPullRequestStatus, _createPullRequestOperations] = useCreatePullRequest()

	return (
		<Content>
			{createPullRequestStatus.progress !== "none" ? (
				<>
					<h1>{createPullRequestStatus.title}</h1>
					<ul className={styles.status}>
						{createPullRequestStatus.legacyStatus.map((string, index) => (
							<li key={index}>{string}</li>
						))}
					</ul>
					{/* TODO: Update this to display the steps instead of the legacy status, once you build that */}
				</>
			) : (
				<>
					<h1>Ready!</h1>
					<p>This page will show the current status, once there's some current status to show.</p>
				</>
			)}
		</Content>
	)
}

"use client"

import React from "react"
import styles from "./page.module.css"
import { Content } from "@/components/ContentStack"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import Figma from "./Figma"
import GitHub from "./GitHub"
import Failed from "./Failed"
import Completed from "./Completed"

export default function Status() {
	const [createPullRequestStatus, _createPullRequestOperations] = useCreatePullRequest()

	return (
		<Content>
			{createPullRequestStatus.progress !== "none" ? (
				<>
					<h1>{createPullRequestStatus.title}</h1>
					<ul className={styles.status}>
						{createPullRequestStatus.steps.map((step, index) =>
							step.type === "github" ? (
								<GitHub key={`step${index}`} {...step} />
							) : step.type === "figma" ? (
								<Figma key={`step${index}`} {...step} />
							) : step.type === "failed" ? (
								<Failed key={`step${index}`} {...step} />
							) : step.type === "completed" ? (
								<Completed key={`step${index}`} {...step} />
							) : (
								`Unknown step type: ${(step as any).type}`
							)
						)}
					</ul>
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

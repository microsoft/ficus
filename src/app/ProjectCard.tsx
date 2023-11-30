"use client"

import React from "react"
import styles from "./ProjectCard.module.css"
import { Button, Card, Title2, Body1 } from "@fluentui/react-components"
import { useRouter } from "next/navigation"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import type { Project } from "@/projects"
import { parseGitHubBlobUrl } from "@/utils/github"

export interface ProjectCardProps {
	project: Project
}

export function ProjectCard(props: ProjectCardProps) {
	const router = useRouter()
	const [createPullRequestStatus, createPullRequestOperations] = useCreatePullRequest()
	const isBusy = createPullRequestStatus.progress === "busy"
	const gitHub = parseGitHubBlobUrl(props.project.manifestUrl)

	return (
		<Card>
			<Title2 as="h2" style={{ margin: 0 }}>
				{props.project.name}
			</Title2>
			<Body1>{gitHub ? `${gitHub.owner}/${gitHub.repo} (${gitHub.branch})` : props.project.manifestUrl}</Body1>
			<div className={styles.horizontal}>
				<Button appearance="outline" disabled>
					Forget this project
				</Button>
				<div className={styles.spacer} />
				<Button appearance="primary" onClick={() => createFigmaPullRequest(props.project)} disabled={isBusy}>
					Create a pull request
				</Button>
			</div>
		</Card>
	)

	async function createFigmaPullRequest(project: Project) {
		if (isBusy || !project) return
		router.push("/status")
		createPullRequestOperations.createFigmaPullRequest(project)
	}
}
export default ProjectCard

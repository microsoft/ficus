"use client"

import React from "react"
import styles from "./ProjectCard.module.css"
import { Button, Card, Title2, Body1 } from "@fluentui/react-components"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import type { Project } from "@/projects"
import { parseGitHubBlobUrl } from "@/utils/github"

export interface ProjectCardProps {
	project: Project
	isBusy: boolean
	createFigmaPullRequest: (project: Project) => void
	forgetProject: (project: Project) => void
}

export function ProjectCard(props: ProjectCardProps) {
	const [createPullRequestStatus, _createPullRequestOperations] = useCreatePullRequest()
	const isBusy = createPullRequestStatus.progress === "busy"
	const gitHub = parseGitHubBlobUrl(props.project.manifestUrl)

	return (
		<Card>
			<Title2 as="h2" style={{ margin: 0 }}>
				{props.project.name}
			</Title2>
			<Body1>{gitHub ? `${gitHub.owner}/${gitHub.repo} (${gitHub.branch})` : props.project.manifestUrl}</Body1>
			<div className={styles.horizontal}>
				<Button appearance="outline" onClick={() => props.forgetProject(props.project)} disabled={isBusy}>
					Forget this project
				</Button>
				<div className={styles.spacer} />
				<Button appearance="primary" onClick={() => props.createFigmaPullRequest(props.project)} disabled={isBusy}>
					Create a pull request
				</Button>
			</div>
		</Card>
	)
}
export default ProjectCard

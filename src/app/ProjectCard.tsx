"use client"

import React from "react"
import styles from "./ProjectCard.module.css"
import {
	Button,
	SplitButton,
	Menu,
	MenuItem,
	MenuList,
	MenuPopover,
	MenuTrigger,
	Card,
	LargeTitle,
	Body1,
} from "@fluentui/react-components"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import type { Project } from "@/projects"
import { parseGitHubBlobUrl } from "@/utils/github"
import ThumbnailStack from "@/components/ThumbnailStack"

export interface ProjectCardProps {
	project: Project
	isBusy: boolean
	showForgetButton?: boolean
	createFigmaPullRequest: (project: Project, options?: { draft?: boolean }) => void
	forgetProject: (project: Project) => void
}

export function ProjectCard(props: ProjectCardProps) {
	const [createPullRequestStatus, _createPullRequestOperations] = useCreatePullRequest()
	const isBusy = createPullRequestStatus.progress === "busy"
	const gitHub = parseGitHubBlobUrl(props.project.manifestUrl)

	return (
		<Card>
			<div className={styles.cardcontent}>
				<ThumbnailStack project={props.project} />
				<LargeTitle as="h2" style={{ margin: 0 }}>
					{props.project.name}
				</LargeTitle>
				<Body1>{gitHub ? `${gitHub.owner}/\u200b${gitHub.repo} (${gitHub.branch})` : props.project.manifestUrl}</Body1>
				<div className={styles.horizontal}>
					<Menu positioning="below-end">
						<MenuTrigger disableButtonEnhancement>
							{triggerProps => (
								<SplitButton
									appearance="primary"
									menuButton={triggerProps}
									primaryActionButton={{
										onClick() {
											props.createFigmaPullRequest(props.project)
										},
									}}
									disabled={isBusy}
								>
									Create a pull request
								</SplitButton>
							)}
						</MenuTrigger>

						<MenuPopover>
							<MenuList>
								<MenuItem onClick={() => props.createFigmaPullRequest(props.project)}>Ready for review</MenuItem>
								<MenuItem onClick={() => props.createFigmaPullRequest(props.project, { draft: true })}>Draft</MenuItem>
							</MenuList>
						</MenuPopover>
					</Menu>
					{props.showForgetButton !== false && (
						<>
							<div className={styles.spacer} />
							<Button appearance="outline" onClick={() => props.forgetProject(props.project)} disabled={isBusy}>
								Forget this project
							</Button>
						</>
					)}
				</div>
			</div>
		</Card>
	)
}
export default ProjectCard

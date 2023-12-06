"use client"

import React from "react"
import styles from "./page.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Display, Title2, Body1, Button } from "@fluentui/react-components"
import { Content, ContentStack } from "@/components/ContentStack"
import { LinkButton } from "@/components/LinkButton"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import type { Project } from "@/projects"
import { getProjectManager } from "@/projects"
import { ProjectCard } from "./ProjectCard"
import { ZeroCard } from "./ZeroCard"

export default function Home() {
	const router = useRouter()
	const [createPullRequestStatus, createPullRequestOperations] = useCreatePullRequest()
	const isBusy = createPullRequestStatus.progress === "busy"
	const [projects, setProjects] = React.useState<readonly Project[] | null>(null)
	const [, forceUpdate] = React.useReducer(_ => !_, false)

	React.useEffect(() => {
		setProjects(getProjectManager().getAll())
	}, [])

	return (
		<ContentStack>
			<Content>
				{projects === null ? null : isBusy ? (
					<Link href="/status">Working...</Link>
				) : projects.length > 0 ? (
					<>
						<Display as="h1">Welcome back</Display>
						<div className={styles.horizontal}>
							<Title2 as="h2" block>
								Your projects
							</Title2>
							<div className={styles.spacer}></div>
							<LinkButton appearance="outline" href="/projects/add">
								Add a project
							</LinkButton>
						</div>
						<div className={styles.projectlist}>
							{projects.map(project => (
								<ProjectCard
									key={project.manifestUrl}
									project={project}
									isBusy={isBusy}
									createFigmaPullRequest={createFigmaPullRequest}
									forgetProject={forgetProject}
								/>
							))}
						</div>
					</>
				) : (
					<>
						<Display as="h1">You change variables &amp; Ficus changes code.</Display>

						<div className={styles.zero}>
							<ZeroCard />
						</div>

						<Title2 as="h2" block>
							What is Ficus?
						</Title2>

						<Body1 as="p" block>
							Ficus syncs variables in Figma to tokens in GitHub. Update values in the single source of truth and let Ficus do
							the rest.
						</Body1>

						<Body1 as="p" block>
							Setup is easy. You'll need a Figma enterprise plan, and an engineer needs to{" "}
							<Link href="/help/onboarding/repo">add a simple project file to the GitHub repo</Link>. Then Ficus automates
							token handoff.
						</Body1>

						<Body1 as="p" block>
							<LinkButton href="/help" appearance="outline">
								Learn more about Ficus
							</LinkButton>
						</Body1>
					</>
				)}
			</Content>
		</ContentStack>
	)

	async function createFigmaPullRequest(project: Project) {
		if (isBusy || !project) return
		router.push("/status")
		createPullRequestOperations.createFigmaPullRequest(project)
	}

	async function forgetProject(project: Project) {
		if (isBusy || !project) return
		getProjectManager().remove(project.manifestUrl)
		// Project manager isn't a store and doesn't notify changes, so we need to force an update
		forceUpdate()
	}
}

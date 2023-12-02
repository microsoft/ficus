"use client"

import React from "react"
import styles from "./page.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Display, Title2, Body1, Button } from "@fluentui/react-components"
import { Content, ContentStack } from "@/components/ContentStack"
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
							<Button appearance="outline" onClick={() => router.push("/projects/add")}>
								Add a project
							</Button>
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
						<p></p>

						<ZeroCard />

						<Title2 as="h2" block>
							It'll just take a few minutes to get started.
						</Title2>

						<Body1 as="p" block>
							An engineer who works in your repo needs to finish a few setup steps described in{" "}
							<Link href="/help/onboarding/repo">Preparing your GitHub repo to work with Ficus</Link>. Then you're ready to
							go!
						</Body1>

						<Body1 as="p" block>
							Ficus is an internal tool and is not supported or warranted in any way.
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

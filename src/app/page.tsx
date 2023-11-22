"use client"

import React from "react"
import styles from "./page.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AccentButton } from "@/components/Button"
import { Content } from "@/components/ContentStack"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import { Project, getProjectManager } from "@/projects"

export default function Home() {
	const router = useRouter()
	const [createPullRequestStatus, createPullRequestOperations] = useCreatePullRequest()
	const isBusy = createPullRequestStatus.progress === "busy"
	const projects = getProjectManager().getAll()

	return (
		<Content>
			<h1>You change variables &amp; Ficus changes code.</h1>
			{createPullRequestStatus.progress === "busy" ? (
				<Link href="/status">Working...</Link>
			) : projects.length > 0 ? (
				projects.map(project => (
					<div key={project.manifestUrl}>
						<h2>{project.name}</h2>
						<div className={styles.horizontal}>
							<AccentButton onClick={() => createFigmaPullRequest(project)} disabled={isBusy}>
								Create a pull request
							</AccentButton>
						</div>
					</div>
				))
			) : projects.length === 0 ? (
				<>
					<h2>It'll just take a few minutes to get started.</h2>
					<p>You only have to do this once. Choose which page sounds more appropriate for you:</p>
					<ul>
						<li>
							<a href="/help/onboarding/repo">Preparing your GitHub repo to work with Ficus</a> (recommended for engineers)
						</li>
						<li>
							<a href="/help/onboarding/usage">Setting up Ficus and making your first pull request</a> (recommended for
							designers)
						</li>
					</ul>
				</>
			) : null}
		</Content>
	)

	async function createFigmaPullRequest(project: Project) {
		if (isBusy || !project) return
		router.push("/status")
		createPullRequestOperations.createFigmaPullRequest(project)
	}
}

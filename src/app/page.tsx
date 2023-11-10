"use client"

import React from "react"
import styles from "./page.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AccentButton } from "@/components/Button"
import { Content } from "@/components/ContentStack"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import { isProperlyConfigured } from "@/utils/config"
import { getManifestPath } from "@/utils/config"
import { parseGitHubBlobUrl } from "@/utils/github"

export default function Home() {
	const router = useRouter()
	const [isConfigured, setIsConfigured] = React.useState<boolean | null>(null)
	const [repoName, setRepoName] = React.useState<string | null>(null)
	const [createPullRequestStatus, createPullRequestOperations] = useCreatePullRequest()
	const isBusy = createPullRequestStatus.progress === "busy"

	React.useEffect(() => {
		// Only access config settings from effects, since localStorage doesn't exist on the server
		if (isProperlyConfigured()) {
			const repoInfo = parseGitHubBlobUrl(getManifestPath()!)
			if (repoInfo) {
				setRepoName(`${repoInfo.owner}/${repoInfo.repo} (${repoInfo.branch})`)
			}
			setIsConfigured(true)
		} else {
			setIsConfigured(false)
		}
	}, [])

	return (
		<Content>
			<h1>
				You change variables
				<br />
				&amp; Ficus changes code.
			</h1>
			{createPullRequestStatus.progress === "busy" ? (
				<Link href="/status">Working...</Link>
			) : isConfigured === true ? (
				<>
					<div className={styles.horizontal}>
						<AccentButton onClick={createFigmaPullRequest} disabled={isBusy}>
							Create a pull request
						</AccentButton>
					</div>
					{repoName && <div className={styles.repoinfo}>{repoName}</div>}
				</>
			) : isConfigured === false ? (
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

	async function createFigmaPullRequest() {
		if (isBusy) return
		router.push("/status")
		createPullRequestOperations.createFigmaPullRequest()
	}
}

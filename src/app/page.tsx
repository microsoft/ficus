"use client"

import React from "react"
import styles from "./page.module.css"
import { useRouter } from "next/navigation"
import { AccentButton } from "@/components/Button"
import { Content } from "@/components/ContentStack"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import { isProperlyConfigured } from "@/utils/config"

export default function Home() {
	const router = useRouter()
	const [isReady, setIsReady] = React.useState<boolean | null>(null)
	const [createPullRequestStatus, createPullRequestOperations] = useCreatePullRequest()
	const isBusy = createPullRequestStatus.progress === "busy"

	React.useEffect(() => {
		// Only access config settings from effects, since localStorage doesn't exist on the server
		setIsReady(isProperlyConfigured())
	}, [])

	return (
		<Content>
			<h1>
				You change variables
				<br />
				&amp; Ficus changes code.
			</h1>
			{isReady === true && (
				<>
					<div className={styles.horizontal}>
						<AccentButton onClick={createFigmaPullRequest} disabled={isBusy}>
							Create a PR of my changes
						</AccentButton>
					</div>
				</>
			)}
			{isReady === false && (
				<>
					<h2>It'll just take a few minutes to get started.</h2>
					<p>You only have to do this once. Start with that Settings link above!</p>
				</>
			)}
		</Content>
	)

	async function createFigmaPullRequest() {
		if (isBusy) return
		createPullRequestOperations.createFigmaPullRequest()
		router.push("/status")
	}
}

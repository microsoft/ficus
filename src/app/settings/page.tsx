"use client"

import React from "react"
import styles from "./page.module.css"
import { useRouter } from "next/navigation"
import { Button, Input, Field, Display, Title2, Title3, Body1 } from "@fluentui/react-components"
import { Content } from "@/components/ContentStack"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import { getProjectManager } from "@/projects"
import { parseGitHubBlobUrl } from "@/utils/github"

export default function Settings() {
	const project = getProjectManager().getActive()
	const router = useRouter()
	const [createPullRequestStatus, _createPullRequestOperations] = useCreatePullRequest()
	const [newFigmaAccessToken, setNewFigmaAccessToken] = React.useState(project ? project.figma.accessToken : "")
	const [newGitHubAccessToken, setNewGitHubAccessToken] = React.useState(project ? project.gitHub.accessToken : "")
	const [newManifestPath, setNewManifestPath] = React.useState(project ? project.manifestUrl : "")
	const [isBusy, setIsBusy] = React.useState(false)
	const [errorText, setErrorText] = React.useState<string | null>(null)
	const isProperlyConfigured = !!parseGitHubBlobUrl(newManifestPath) && !!newFigmaAccessToken && !!newGitHubAccessToken

	return (
		<Content>
			<Display as="h1">Login and settings</Display>
			{createPullRequestStatus.progress !== "busy" ? (
				<>
					<Body1 as="p" block>
						Settings will be stored only on this device.
					</Body1>
					<div className={styles.vertical}>
						<Field
							label="GitHub link to ficus.json (e.g. https://github.com/TravisSpomer/MyTokens/blob/main/src/ficus.json)"
							hint={
								<>
									If you don't have one, see{" "}
									<a href="/help/onboarding/repo">Preparing your GitHub repo to work with Ficus</a>.
								</>
							}
							validationState={errorText ? "error" : "none"}
							validationMessage={errorText}
						>
							<Input
								type="text"
								required
								value={newManifestPath}
								disabled={isBusy}
								onChange={ev => setNewManifestPath(ev.target.value)}
								style={{ width: "100%" }}
							/>
						</Field>
						<Field label="Figma access token">
							<Input
								type="password"
								required
								value={newFigmaAccessToken}
								disabled={isBusy}
								onChange={ev => setNewFigmaAccessToken(ev.target.value)}
								style={{ width: "100%" }}
							/>
						</Field>
						<Field label="GitHub access token">
							<Input
								type="password"
								required
								value={newGitHubAccessToken}
								disabled={isBusy}
								onChange={ev => setNewGitHubAccessToken(ev.target.value)}
								style={{ width: "100%" }}
							/>
						</Field>
					</div>
					<Body1 as="p" block>
						<Button appearance="primary" onClick={onDone} disabled={isBusy || !isProperlyConfigured}>
							Save
						</Button>
					</Body1>
				</>
			) : (
				<Body1 as="p" block>
					You can change settings after Ficus finishes opening a pull request.
				</Body1>
			)}
			<div className={styles.bigspacer} />
			<Title2 as="h2" block>
				How do I get access tokens?
			</Title2>
			<Body1 as="p" block>
				Treat an access token like a password and never share it with anyone. But unlike a password, once you paste your tokens
				here, you don't need to save them anywhere else. Here's how you get them:
			</Body1>
			<Title3 as="h3" block>
				Figma
			</Title3>
			<Body1 as="p" block>
				In your{" "}
				<a href="https://www.figma.com/settings" target="_blank">
					Figma settings
				</a>
				, scroll down to Personal access tokens and click Generate new token. Copy and paste that token into the box above.
			</Body1>
			<Title3 as="h3" block>
				GitHub
			</Title3>
			<Body1 as="p" block>
				You can generate a Personal Access Token from your{" "}
				<a href="https://github.com/settings/tokens?type=beta" target="_blank">
					GitHub Developer Settings page
				</a>
				. Create a fine-grained PAT, with Resource Owner set to the account that owns the repo containing your tokens, Repository
				Access set to All Repositories (or just the ones you need), and enable repository permissions for Contents, Metadata, and
				Pull Requests. Copy and paste that token into the box above.
			</Body1>
		</Content>
	)

	async function onDone() {
		setErrorText(null)
		if (isBusy || !isProperlyConfigured) return

		try {
			setIsBusy(true)
			const projectManager = getProjectManager()
			const newProject = await projectManager.test({
				manifestUrl: newManifestPath,
				figma: {
					accessToken: newFigmaAccessToken,
				},
				gitHub: {
					accessToken: newGitHubAccessToken,
				},
			})
			if (!newProject) return
			projectManager.clear()
			projectManager.add(newProject)

			router.push("/")
		} catch (ex) {
			setErrorText(
				`I wasn't able to connect to that ficus.json file, either because it doesn't exist at that address or the GitHub access token didn't have access to it.${
					ex instanceof Error ? ` (${ex})` : ""
				}`
			)
		} finally {
			setIsBusy(false)
		}
	}
}

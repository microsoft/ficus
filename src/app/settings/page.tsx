"use client"

import React from "react"
import styles from "./page.module.css"
import { useRouter } from "next/navigation"
import { AccentButton } from "@/components/Button"
import { Content } from "@/components/ContentStack"
import Textbox from "@/components/Textbox"
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
			<h1>Login and settings</h1>
			{createPullRequestStatus.progress !== "busy" ? (
				<>
					<p>Settings will be stored only on this device.</p>
					<div className={styles.vertical}>
						<p>
							<label>
								GitHub link to ficus.json (e.g. https://github.com/TravisSpomer/MyTokens/blob/main/src/ficus.json)
								<br />
								<Textbox
									required
									value={newManifestPath}
									disabled={isBusy}
									onChange={ev => setNewManifestPath(ev.target.value)}
								/>
								<br />
								If you don't have one, see <a href="/help/onboarding/repo">Preparing your GitHub repo to work with Ficus</a>
								.
							</label>
						</p>
						{errorText && <div className={styles.error}>{errorText}</div>}
						<p>
							<label>
								Figma access token
								<br />
								<Textbox
									type="password"
									required
									value={newFigmaAccessToken}
									disabled={isBusy}
									onChange={ev => setNewFigmaAccessToken(ev.target.value)}
								/>
							</label>
						</p>
						<p>
							<label>
								GitHub access token
								<br />
								<Textbox
									type="password"
									required
									value={newGitHubAccessToken}
									disabled={isBusy}
									onChange={ev => setNewGitHubAccessToken(ev.target.value)}
								/>
							</label>
						</p>
					</div>
					<AccentButton onClick={onDone} disabled={isBusy || !isProperlyConfigured}>
						Save
					</AccentButton>
				</>
			) : (
				<p>You can change settings after Ficus finishes opening a pull request.</p>
			)}
			<div className={styles.bigspacer} />
			<h2>How do I get access tokens?</h2>
			<p>
				Treat an access token like a password and never share it with anyone. But unlike a password, once you paste your tokens
				here, you don't need to save them anywhere else. Here's how you get them:
			</p>
			<h3>Figma</h3>
			<p>
				In your{" "}
				<a href="https://www.figma.com/settings" target="_blank">
					Figma settings
				</a>
				, scroll down to Personal access tokens and click Generate new token. Copy and paste that token into the box above.
			</p>
			<h3>GitHub</h3>
			<p>
				You can generate a Personal Access Token from your{" "}
				<a href="https://github.com/settings/tokens?type=beta" target="_blank">
					GitHub Developer Settings page
				</a>
				. Create a fine-grained PAT, with Resource Owner set to the account that owns the repo containing your tokens, Repository
				Access set to All Repositories (or just the ones you need), and enable repository permissions for Contents, Metadata, and
				Pull Requests. Copy and paste that token into the box above.
			</p>
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

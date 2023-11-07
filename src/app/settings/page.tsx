"use client"

import React from "react"
import styles from "./page.module.css"
import { useRouter } from "next/navigation"
import { AccentButton } from "@/components/Button"
import { Content } from "@/components/ContentStack"
import Textbox from "@/components/Textbox"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import {
	getFigmaAccessToken,
	getGitHubAccessToken,
	getManifestPath,
	setFigmaAccessToken,
	setGitHubAccessToken,
	setManifestPath,
} from "@/utils/config"
import { parseGitHubBlobUrl } from "@/utils/github"

export default function Settings() {
	const router = useRouter()
	const [createPullRequestStatus, _createPullRequestOperations] = useCreatePullRequest()
	const [newFigmaAccessToken, setNewFigmaAccessToken] = React.useState(getFigmaAccessToken() || "")
	const [newGitHubAccessToken, setNewGitHubAccessToken] = React.useState(getGitHubAccessToken() || "")
	const [newManifestPath, setNewManifestPath] = React.useState(getManifestPath() || "")
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
								<Textbox required value={newManifestPath} onChange={ev => setNewManifestPath(ev.target.value)} />
							</label>
						</p>
						<p>
							<label>
								Figma access token
								<br />
								<Textbox required value={newFigmaAccessToken} onChange={ev => setNewFigmaAccessToken(ev.target.value)} />
							</label>
						</p>
						<p>
							<label>
								GitHub access token
								<br />
								<Textbox required value={newGitHubAccessToken} onChange={ev => setNewGitHubAccessToken(ev.target.value)} />
							</label>
						</p>
					</div>
					<AccentButton onClick={onDone} disabled={!isProperlyConfigured}>
						Save
					</AccentButton>
				</>
			) : (
				<p>You can change settings once Ficus is no longer busy opening a pull request.</p>
			)}
			<div className={styles.bigspacer} />
			<h2>How do I get access tokens?</h2>
			<p>
				You'll need to get access tokens manually—that's just a temporary limitation for now. Each service has different ways of
				getting one. Treat your access tokens like a password and never share them with anyone. Do not use the access tokens you
				create for this app with anything else.
			</p>
			<h3>Figma</h3>
			<p>
				In your{" "}
				<a href="https://www.figma.com/settings" target="_blank">
					Figma settings
				</a>
				, scroll down to Personal access tokens and click Generate new token.
			</p>
			<h3>GitHub</h3>
			<p>
				You can generate a Personal Access Token from your{" "}
				<a href="https://github.com/settings/tokens?type=beta" target="_blank">
					GitHub Developer Settings page
				</a>
				. Create a fine-grained PAT, with Resource Owner set to the account that owns the repo containing your tokens, Repository
				Access set to All Repositories (or just the ones you need), and enable repository permissions for Contents, Metadata, and
				Pull Requests.
			</p>
			<h2>What does a ficus.json file look like?</h2>
			<p>You'll need a JSON file stored in GitHub in the same folder as your token files that looks like this:</p>
			<pre className={styles.tabbed}>
				<code>
					{`{
	"name": "My design system",
	"figma": {
		"files": [
			{
				"key": "https://www.figma.com/file/abcdefg1234567890/My-variables-file",
				"collections": {
					"Global tokens": {
						"modes": {
							"Value": [ "global.json", "global.brand.json" ]
						}
					}
				}
			}
		]
	}
}`}
				</code>
			</pre>
		</Content>
	)

	function onDone() {
		if (!isProperlyConfigured) return

		setManifestPath(newManifestPath)
		setFigmaAccessToken(newFigmaAccessToken)
		setGitHubAccessToken(newGitHubAccessToken)

		router.push("/")
	}
}

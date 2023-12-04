"use client"

import React from "react"
import styles from "./page.module.css"
import { useRouter } from "next/navigation"
import { Display, Title1, Title2, Body1, Body1Strong, Card, Button, Input, Field } from "@fluentui/react-components"
import { Content, ContentStack } from "@/components/ContentStack"
import type { Project } from "@/projects"
import { getProjectManager } from "@/projects"

const enum Pages {
	Welcome = 0,
	ProjectLocation,
	GitHubToken,
	FigmaToken,
	Done,
}

export default function AddProject() {
	const router = useRouter()
	const [isBusy, setIsBusy] = React.useState(false)
	const [currentPage, setCurrentPage] = React.useState(0)
	const isFirstProject = getProjectManager().length === 0
	const [newManifestPath, setNewManifestPath] = React.useState("")
	const [manifestPathError, setManifestPathError] = React.useState<string | null>(null)
	const [newGitHubAccessToken, setNewGitHubAccessToken] = React.useState("")
	const [gitHubError, setGitHubError] = React.useState<string | null>(null)
	const [newFigmaAccessToken, setNewFigmaAccessToken] = React.useState("")
	const [figmaError, setFigmaError] = React.useState<string | null>(null)
	const [finalProject, setFinalProject] = React.useState<Project | null>(null)

	return (
		<ContentStack>
			<Content>
				{isFirstProject ? <Display as="h1">Get started</Display> : <Display as="h1">Add a project</Display>}
				<p></p>
				<Card size="large">
					<div className={styles.cardcontent}>
						{currentPage === Pages.Welcome ? (
							<>
								<Title1 as="h2">Let's add a new project</Title1>
								{isFirstProject ? (
									<>
										<Body1 as="p" block>
											This will just take a minute or two, and we'll walk you through everything you need. You only
											have to do this once.
										</Body1>
										<Body1Strong as="p" block>
											You need a Figma Enterprise plan to use Ficus. These features won't work without one.
										</Body1Strong>{" "}
									</>
								) : (
									<>
										{" "}
										<Body1 as="p" block>
											This project will be completely independent from any project you've used previously. You can set
											up as many as you need.
										</Body1>
									</>
								)}
							</>
						) : currentPage === Pages.ProjectLocation ? (
							<>
								<Title1 as="h2">Add your project file</Title1>
								<Body1 as="p" block>
									The Ficus project file tells Ficus which variable collections in which Figma files are connected to
									files on GitHub. If an engineer partner set up Ficus already, they can tell you what to paste here.
								</Body1>
								<Field
									label="Address of project on GitHub (e.g. https://github.com/TravisSpomer/MyTokens/blob/main/src/ficus.json)"
									validationState={manifestPathError ? "error" : "none"}
									validationMessage={manifestPathError}
								>
									<Input
										type="text"
										required
										value={newManifestPath}
										disabled={false}
										onChange={ev => setNewManifestPath(ev.target.value)}
										style={{ width: "100%" }}
									/>
								</Field>
							</>
						) : currentPage === Pages.GitHubToken ? (
							<>
								<Title1 as="h2">Add your GitHub access token</Title1>
								<Body1 as="p" block>
									Treat it like a password and don't share it with anyone. We'll save it on this device so you don't have
									to.
								</Body1>
								<Field
									label="GitHub access token"
									validationState={gitHubError ? "error" : "none"}
									validationMessage={gitHubError}
								>
									<Input
										type="password"
										required
										value={newGitHubAccessToken}
										disabled={false}
										onChange={ev => setNewGitHubAccessToken(ev.target.value)}
										style={{ width: "100%" }}
									/>
								</Field>
								{gitHubError && (
									<>
										<Body1 as="p" block>
											Here are a few things to check:
										</Body1>
										<ul>
											<li>Did you copy the entire access token from GitHub?</li>
											<li>
												Does that access token grant access to the project file? (You may need a different GitHub
												access token for each repo.)
											</li>
											<li>Did you enter the project path correctly on the previous page?</li>
										</ul>
									</>
								)}
							</>
						) : currentPage === Pages.FigmaToken ? (
							<>
								<Title1 as="h2">Add your Figma access token</Title1>
								<Body1 as="p" block>
									Treat it like a password and don't share it with anyone. We'll save it on this device so you don't have
									to.
								</Body1>
								<Field
									label="Figma access token"
									validationState={figmaError ? "error" : "none"}
									validationMessage={figmaError}
								>
									<Input
										type="password"
										required
										value={newFigmaAccessToken}
										disabled={false}
										onChange={ev => setNewFigmaAccessToken(ev.target.value)}
										style={{ width: "100%" }}
									/>
								</Field>
							</>
						) : currentPage === Pages.Done ? (
							<>
								<Title1 as="h2">You're all set up!</Title1>
								<Title2 as="h3">{finalProject!.name}</Title2>
								<Body1 as="p" block>
									Ficus can now open pull requests to sync your variables to code.
								</Body1>
							</>
						) : null}
						<div className={styles.horizontal}>
							<div>
								{currentPage > 0 && currentPage < Pages.Done && (
									<Button appearance="secondary" onClick={previousPage} disabled={isBusy}>
										Back
									</Button>
								)}
							</div>
							<div className={styles.spacer}></div>
							<div>
								<Button appearance="primary" onClick={nextPage} disabled={isBusy}>
									{currentPage === Pages.Done ? "Finish" : "Next"}
								</Button>
							</div>
						</div>
					</div>
				</Card>
			</Content>
			<Content>
				<div className={styles.aftercard}>
					{currentPage === Pages.ProjectLocation ? (
						<>
							<Title2 as="h2" block>
								Don't have a project set up yet?
							</Title2>
							<Body1 as="p" block>
								If you don't have one, see <a href="/help/onboarding/repo">Preparing your GitHub repo to work with Ficus</a>
								. You need to be comfortable editing JSON files for this part.
							</Body1>
						</>
					) : currentPage === Pages.GitHubToken ? (
						<>
							<Title2 as="h2" block>
								How to get a GitHub access token
							</Title2>
							<Body1 as="p" block>
								You can generate a Personal Access Token from your{" "}
								<a href="https://github.com/settings/tokens?type=beta" target="_blank">
									GitHub Developer Settings page
								</a>
								. Create a fine-grained PAT, with Resource Owner set to the account that owns the repo containing your
								tokens, Repository Access set to All Repositories (or just the ones you need), and enable repository
								permissions for Contents, Metadata, and Pull Requests. Copy and paste that token into the box above.
							</Body1>
							<Body1 as="p" block>
								A Personal Access Token is not related to design tokens—just a coincidence.
							</Body1>
						</>
					) : currentPage === Pages.FigmaToken ? (
						<>
							<Title2 as="h2" block>
								How to get a Figma access token
							</Title2>
							<Body1 as="p" block>
								In your{" "}
								<a href="https://www.figma.com/settings" target="_blank">
									Figma settings
								</a>
								, scroll down to Personal access tokens and click Generate new token. Copy and paste that token into the box
								above.
							</Body1>
						</>
					) : null}
				</div>
			</Content>
		</ContentStack>
	)

	async function nextPage() {
		try {
			setIsBusy(true)
			switch (currentPage) {
				case Pages.Welcome:
					// No validation required
					break
				case Pages.ProjectLocation:
					{
						// The URL must be valid
						const results = await getProjectManager().test({ manifestUrl: newManifestPath })
						if (!results.isProjectLocationValid) {
							setManifestPathError("Check your project location: it should look like the example.")
							return
						}
						// It must not already be a known project
						if (getProjectManager().getItem(newManifestPath)) {
							setManifestPathError("This project has already been added. You can only add each project once.")
							return
						}
						setManifestPathError(null)
					}
					break
				case Pages.GitHubToken:
					{
						// The access token must allow us to read the project file
						const results = await getProjectManager().test({
							manifestUrl: newManifestPath,
							gitHub: { accessToken: newGitHubAccessToken },
						})
						if (!results.isGitHubAccessValid) {
							setGitHubError("That didn't work.")
							return
						}
						setGitHubError(null)
					}
					break
				case Pages.FigmaToken:
					{
						// The access token must be valid
						const results = await getProjectManager().test({
							manifestUrl: newManifestPath,
							gitHub: { accessToken: newGitHubAccessToken },
							figma: { accessToken: newFigmaAccessToken },
						})
						if (!results.isFigmaAccessValid) {
							setFigmaError("Include your Figma access token.")
							return
						}
						setFigmaError(null)
						if (!results.project) throw new Error()
						getProjectManager().add(results.project)
						setFinalProject(results.project)
					}
					break
				case Pages.Done: {
					router.push("/")
					return
				}
				default:
					return
			}
		} finally {
			setIsBusy(false)
		}

		setCurrentPage(currentPage + 1)
	}

	function previousPage() {
		if (currentPage <= Pages.Welcome || currentPage >= Pages.Done) return
		setCurrentPage(currentPage - 1)
	}
}

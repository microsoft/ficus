"use client"

import React from "react"
import styles from "./page.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
	Display,
	Title1,
	Title2,
	Body1,
	Body1Strong,
	Card,
	Button,
	Input,
	Combobox,
	Option,
	OptionGroup,
	Field,
	InfoLabel,
	Accordion,
	AccordionHeader,
	AccordionItem,
	AccordionPanel,
} from "@fluentui/react-components"
import { Content, ContentStack } from "@/components/ContentStack"
import type { Project } from "@/projects"
import { getProjectManager } from "@/projects"
import { parseGitHubBlobUrl } from "@/utils/github"
import ThumbnailStack from "@/components/ThumbnailStack"

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
	const [isFirstProject, setIsFirstProject] = React.useState(true)
	const [newManifestPath, setNewManifestPath] = React.useState("")
	const [manifestPathError, setManifestPathError] = React.useState<string | null>(null)
	const [newGitHubAccessToken, setNewGitHubAccessToken] = React.useState("")
	const [isGitHubDropdownOpen, setIsGitHubDropdownOpen] = React.useState(false)
	const [gitHubError, setGitHubError] = React.useState<string | null>(null)
	const [newFigmaAccessToken, setNewFigmaAccessToken] = React.useState("")
	const [isFigmaDropdownOpen, setIsFigmaDropdownOpen] = React.useState(false)
	const [figmaError, setFigmaError] = React.useState<string | null>(null)
	const [finalProject, setFinalProject] = React.useState<Project | null>(null)

	React.useEffect(() => {
		setIsFirstProject(getProjectManager().length === 0)
	}, [])

	let repoOwner: string | null = null
	let repoName: string | null = null
	try {
		const parsed = parseGitHubBlobUrl(newManifestPath)
		repoOwner = parsed ? parsed.owner : null
		repoName = parsed ? parsed.repo : null
	} catch (ex) {
		/* keep repoOwner and repoName null */
	}

	return (
		<ContentStack>
			<Content>
				{currentPage === Pages.Done ? (
					<Display as="h1">Ficus is ready to go</Display>
				) : isFirstProject ? (
					<Display as="h1">Get started</Display>
				) : (
					<Display as="h1">Add a project</Display>
				)}
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
								<Title1 as="h2">Link your project file</Title1>
								<Body1 as="p" block>
									Ficus needs a project file to know where your Figma variables are. If an engineer partner set up Ficus
									already, they can tell you what to paste here.
								</Body1>
								<Field
									label="Address of project on GitHub"
									hint="For example: https://github.com/TravisSpomer/MyTokens/blob/main/src/ficus.json"
									required
									validationState={manifestPathError ? "error" : "none"}
									validationMessage={manifestPathError}
								>
									<Input
										type="text"
										required
										value={newManifestPath}
										onChange={ev => setNewManifestPath(ev.target.value)}
										style={{ width: "100%" }}
									/>
								</Field>
								<Accordion multiple={true}>
									<AccordionItem value="moreinfo">
										<AccordionHeader>Don't have a project file yet?</AccordionHeader>
										<AccordionPanel>
											<Body1 as="p" block>
												See{" "}
												<Link href="/help/onboarding/repo" target="_blank">
													Preparing your GitHub repo to work with Ficus
												</Link>
												. You need to be comfortable editing JSON files for this part, so find an engineer partner
												if that doesn't sound fun.
											</Body1>
										</AccordionPanel>
									</AccordionItem>
								</Accordion>
							</>
						) : currentPage === Pages.GitHubToken ? (
							<>
								<Title1 as="h2">Add your GitHub Personal Access Token</Title1>
								<Body1 as="p" block>
									You can generate a Personal Access Token from your{" "}
									<a href="https://github.com/settings/tokens?type=beta" target="_blank">
										GitHub Developer Settings page
									</a>
									.
								</Body1>{" "}
								<ul>
									<li>Create a fine-grained PAT.</li>
									<li>
										Set Resource Owner to{" "}
										{repoOwner ? (
											<Body1Strong>{repoOwner}</Body1Strong>
										) : (
											"the account that owns the repo containing your tokens"
										)}
										.
									</li>
									<li>
										Set Repository Access to{" "}
										{repoName ? (
											<>
												<Body1Strong>{repoName}</Body1Strong> or{" "}
											</>
										) : null}
										All Repositories.
									</li>
									<li>Enable permissions for Contents, Metadata, and Pull Requests.</li>
								</ul>
								<Field
									label={
										<InfoLabel
											required
											info="Treat it like a password and don't share it with anyone. We'll save it on this device so you don't have
									to."
										>
											GitHub access token
										</InfoLabel>
									}
									validationState={gitHubError ? "error" : "none"}
									validationMessage={gitHubError}
								>
									{isFirstProject ? (
										<Input
											type="password"
											required
											value={newGitHubAccessToken}
											onChange={ev => setNewGitHubAccessToken(ev.target.value)}
											style={{ width: "100%" }}
										/>
									) : (
										<Combobox
											type="password"
											required
											value={newGitHubAccessToken}
											inlinePopup
											open={isGitHubDropdownOpen}
											onChange={ev => {
												setNewGitHubAccessToken(ev.target.value)
												setIsGitHubDropdownOpen(false)
											}}
											onOptionSelect={(ev, data) => setNewGitHubAccessToken(data.optionValue!)}
											onOpenChange={(ev, data) => setIsGitHubDropdownOpen(data.open)}
											selectedOptions={[]}
											style={{ width: "100%" }}
										>
											<OptionGroup label="Paste a new access token, or reuse the one from from">
												{getProjectManager()
													.getAll()
													.map((project, index) => (
														<Option key={index} value={project.gitHub.accessToken}>
															{project.name}
														</Option>
													))}
											</OptionGroup>
										</Combobox>
									)}
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
								<Title1 as="h2">Add your Figma Personal Access Token</Title1>
								<Body1 as="p" block>
									In your{" "}
									<a href="https://www.figma.com/settings" target="_blank">
										Figma settings
									</a>
									, scroll down to Personal access tokens and click Generate new token.
								</Body1>
								<Field
									label={
										<InfoLabel
											required
											info="Treat it like a password and don't share it with anyone. We'll save it on this device so you don't have
									to."
										>
											Figma access token
										</InfoLabel>
									}
									validationState={figmaError ? "error" : "none"}
									validationMessage={figmaError}
								>
									{isFirstProject ? (
										<Input
											type="password"
											required
											value={newFigmaAccessToken}
											onChange={ev => setNewFigmaAccessToken(ev.target.value)}
											style={{ width: "100%" }}
										/>
									) : (
										<Combobox
											type="password"
											required
											value={newFigmaAccessToken}
											inlinePopup
											open={isFigmaDropdownOpen}
											onChange={ev => {
												setNewFigmaAccessToken(ev.target.value)
												setIsFigmaDropdownOpen(false)
											}}
											onOptionSelect={(ev, data) => setNewFigmaAccessToken(data.optionValue!)}
											onOpenChange={(ev, data) => setIsFigmaDropdownOpen(data.open)}
											selectedOptions={[]}
											style={{ width: "100%" }}
										>
											<OptionGroup label="Paste a new access token, or reuse the one from from">
												{getProjectManager()
													.getAll()
													.map((project, index) => (
														<Option key={index} value={project.figma.accessToken}>
															{project.name}
														</Option>
													))}
											</OptionGroup>
										</Combobox>
									)}
								</Field>
								{figmaError && (
									<>
										<Body1 as="p" block>
											Here are a few things to check:
										</Body1>
										<ul>
											<li>Did you copy the entire access token from Figma?</li>
											<li>
												Does that access token grant access to all of the Figma files you need for that project?
											</li>
											<li>Were any of the Figma files in that project deleted or moved?</li>
										</ul>
									</>
								)}
							</>
						) : currentPage === Pages.Done ? (
							<>
								<ThumbnailStack project={finalProject!} />
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
									{currentPage >= Pages.Done ? "Got it" : currentPage === Pages.Done - 1 ? "Finish" : "Next"}
								</Button>
							</div>
						</div>
					</div>
				</Card>
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
							figma: { accessToken: newFigmaAccessToken, metadata: {} },
						})
						if (!results.isFigmaAccessValid) {
							setFigmaError("That didn't work.")
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

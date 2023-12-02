"use client"

import { getFileJSON, parseGitHubBlobUrl } from "@/utils/github"

export function getProjectManager(): ProjectManager {
	if (!instance) {
		instance = new ProjectManager()
	}
	return instance
}

let instance: ProjectManager | undefined

interface StoredProjectManagerData {
	projects: Project[]
}

export interface Project {
	name: string
	manifestUrl: string
	gitHub: {
		accessToken: string
	}
	figma: {
		accessToken: string
	}
}

const ProjectsStorageKey = "Projects"
const LegacyManifestPathStorageKey = "Manifest path"
const LegacyGitHubAccessTokenStorageKey = "GitHub access token"
const LegacyFigmaAccessTokenStorageKey = "Figma access token"

class ProjectManager {
	#data: StoredProjectManagerData

	constructor() {
		const isBrowser = "localStorage" in globalThis
		let data: StoredProjectManagerData | undefined
		if (isBrowser) {
			const storedData = localStorage.getItem(ProjectsStorageKey)
			if (storedData) {
				data = JSON.parse(storedData)
			} else {
				const legacyManifestPath = localStorage.getItem(LegacyManifestPathStorageKey)
				const legacyGitHubAccessToken = localStorage.getItem(LegacyGitHubAccessTokenStorageKey)
				const legacyFigmaAccessToken = localStorage.getItem(LegacyFigmaAccessTokenStorageKey)
				if (legacyManifestPath && legacyGitHubAccessToken && legacyFigmaAccessToken) {
					const repoInfo = parseGitHubBlobUrl(legacyManifestPath)
					data = {
						projects: [
							{
								name: repoInfo ? `${repoInfo.owner}/${repoInfo.repo} (${repoInfo.branch})` : "My project",
								manifestUrl: legacyManifestPath,
								gitHub: {
									accessToken: legacyGitHubAccessToken,
								},
								figma: {
									accessToken: legacyFigmaAccessToken,
								},
							},
						],
					}
				}
			}
		}
		this.#data = data || { projects: [] }
	}

	#save() {
		localStorage.setItem(ProjectsStorageKey, JSON.stringify(this.#data))
		localStorage.removeItem(LegacyManifestPathStorageKey)
		localStorage.removeItem(LegacyGitHubAccessTokenStorageKey)
		localStorage.removeItem(LegacyFigmaAccessTokenStorageKey)
	}

	#findIndex(manifestUrl: string): number {
		return this.#data.projects.findIndex(thisProject => thisProject.manifestUrl === manifestUrl)
	}

	get length(): number {
		return this.#data.projects.length
	}

	getAll(): Readonly<readonly Project[]> {
		return this.#data.projects
	}

	getItem(manifestUrl: string): Readonly<Project> | null {
		const index = this.#findIndex(manifestUrl)
		return index >= 0 ? this.#data.projects[index] : null
	}

	async test(project: Partial<Project>): Promise<TestResults> {
		const results: TestResults = {
			isProjectLocationValid: false,
			isGitHubAccessValid: false,
			isFigmaAccessValid: false,
			project: null,
		}

		// Manifest URL is mandatory, and must be a valid GitHub URL.
		if (!project.manifestUrl) return results
		const repoInfo = parseGitHubBlobUrl(project.manifestUrl)
		if (!repoInfo) return results
		results.isProjectLocationValid = true

		// GitHub access token must be valid, and must be sufficient for accessing the project file.
		if (!project.gitHub || !project.gitHub.accessToken) return results
		let projectName: string
		try {
			const manifest = await getFileJSON(
				project as Pick<Project, "gitHub">,
				repoInfo.owner,
				repoInfo.repo,
				repoInfo.branch,
				repoInfo.path
			)
			projectName = manifest.name
			if (!projectName) return results
		} catch (ex) {
			return results
		}
		results.isGitHubAccessValid = true

		// Figma access token must be present.
		if (!project.figma || !project.figma.accessToken) return results
		results.isFigmaAccessValid = true

		// Looks good! If everything's valid, return the full Project object.
		results.project = {
			...project,
			name: projectName,
		} as Project
		return results
	}

	add(project: Project) {
		this.#data.projects.push(project)
		this.#save()
	}

	remove(manifestUrl: string): void {
		const index = this.#findIndex(manifestUrl)
		if (index >= 0) {
			this.#data.projects.splice(index, 1)
			this.#save()
		} else {
			throw new RangeError()
		}
	}

	clear(): void {
		this.#data.projects.splice(0, Infinity)
		this.#save()
	}
}

interface TestResults {
	isProjectLocationValid: boolean
	isGitHubAccessValid: boolean
	isFigmaAccessValid: boolean
	project: Project | null
}

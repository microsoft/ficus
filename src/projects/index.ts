"use client"

import { JsonManifest } from "@/types/manifest"
import { getFigmaFileMetadata, getFileKeyFromFigmaUrl } from "@/utils/figma"
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
		metadata: { [fileKey: string]: FigmaFileMetadata }
	}
}

export interface FigmaFileMetadata {
	name: string
	thumbnailUrl?: string
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
								name: repoInfo ? `${repoInfo.owner}/\u200b${repoInfo.repo} (${repoInfo.branch})` : "My project",
								manifestUrl: legacyManifestPath,
								gitHub: {
									accessToken: legacyGitHubAccessToken,
								},
								figma: {
									accessToken: legacyFigmaAccessToken,
									metadata: {},
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

		// GitHub access token must be sufficient for accessing the project file.
		if (!project.gitHub || !project.gitHub.accessToken) return results
		let figmaFileKeys: (string | null)[] = []
		try {
			const manifest: JsonManifest = await getFileJSON(
				project as Pick<Project, "gitHub">,
				repoInfo.owner,
				repoInfo.repo,
				repoInfo.branch,
				repoInfo.path
			)
			project.name = manifest.name
			figmaFileKeys = manifest.figma.files.map(file => file.key)
			if (!project.name) return results
		} catch (ex) {
			return results
		}
		results.isGitHubAccessValid = true

		// Figma access token must be sufficient for accessing each of the Figma files.
		if (!project.figma || !project.figma.accessToken) return results
		project.figma.metadata = {}
		try {
			for (let key of figmaFileKeys) {
				if (!key) continue
				key = getFileKeyFromFigmaUrl(key)
				if (!key) return results
				const metadata = await getFigmaFileMetadata(project as Pick<Project, "figma">, key)
				project.figma.metadata[key] = metadata
			}
		} catch (ex) {
			return results
		}
		results.isFigmaAccessValid = true

		// Looks good! If everything's valid, return the full Project object.
		results.project = project as Project
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

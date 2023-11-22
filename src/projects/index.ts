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

type PartialProject = Omit<Project, "name">

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

	getActive(): Project | null {
		// TODO: Delete this shim once multiple projects are supported!
		return this.#data.projects.length ? this.#data.projects[0] : null
	}

	getItem(manifestUrl: string): Readonly<Project> | null {
		const index = this.#findIndex(manifestUrl)
		return index >= 0 ? this.#data.projects[index] : null
	}

	async test(project: PartialProject): Promise<Project | null> {
		const repoInfo = parseGitHubBlobUrl(project.manifestUrl)
		if (!repoInfo) return null
		const newProject: Project = {
			...project,
			name: repoInfo ? `${repoInfo.owner}/${repoInfo.repo} (${repoInfo.branch})` : "New project",
		}
		const manifest = await getFileJSON(newProject, repoInfo.owner, repoInfo.repo, repoInfo.branch, repoInfo.path)
		newProject.name = manifest.name
		return newProject
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

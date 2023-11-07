import type { RepoContentsResponse } from "@/types/github"
import { getGitHubAccessToken } from "./config"
import { mergeRequestInit } from "./fetch"

export function parseGitHubBlobUrl(url: string): { owner: string; repo: string; branch: string; path: string } | null {
	try {
		if (url.includes("..")) return null
		const urlParts = new URL(url)
		if (urlParts.host !== "github.com" && urlParts.host !== "www.github.com") return null
		const results = /^\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/.exec(urlParts.pathname)
		if (!results) return null
		return {
			owner: results[1],
			repo: results[2],
			branch: results[3],
			path: results[4],
		}
	} catch {
		return null
	}
}

async function call<T = any>(url: string, options?: RequestInit): Promise<T> {
	const gitHubAccessToken = getGitHubAccessToken()
	if (!gitHubAccessToken) throw new Error("Can't call APIs without authentication")
	const response = await fetch(
		url,
		mergeRequestInit(
			{
				method: "GET",
				headers: [
					["Accept", "application/vnd.github+json"],
					["Authorization", `Bearer ${gitHubAccessToken}`],
					["X-GitHub-Api-Version", "2022-11-28"],
				],
				next: {
					revalidate: 0, // disable Next.js caching
				},
			},
			options
		)
	)
	const data = await response.json()
	if (!response.ok) throw new Error(typeof data === "object" ? data.message : undefined)

	return data
}

function ensureSlash(path: string): string {
	return path.startsWith("/") ? path : `/${path}`
}

export async function getRepoContents(owner: string, repo: string, branch: string, path: string): Promise<RepoContentsResponse> {
	const data = await call(`https://api.github.com/repos/${owner}/${repo}/contents${ensureSlash(path)}?ref=${branch}`)
	if (Array.isArray(data)) return data
	throw new Error(`The path "${path}" exists but we failed to list its contents.`)
}

export async function getFileJSON(owner: string, repo: string, branch: string, path: string): Promise<any> {
	return call(`https://api.github.com/repos/${owner}/${repo}/contents${ensureSlash(path)}?ref=${branch}`, {
		headers: { Accept: "application/vnd.github.raw" },
	})
}

export interface GitHubUploadFile {
	path: string
	contents: string
}

const enum GitBlobModes {
	File = "100644",
}

export async function createBranch(owner: string, repo: string, branchFrom: string, branchTo: string): Promise<string> {
	// https://docs.github.com/en/rest/git/refs#get-a-reference
	const branchFromLatestCommitSha: string = (await call(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branchFrom}`))
		.object.sha

	// https://docs.github.com/en/rest/git/refs#create-a-reference
	await call(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
		method: "POST",
		body: JSON.stringify({
			ref: `refs/heads/${branchTo}`,
			sha: branchFromLatestCommitSha,
		}),
	})

	return branchFromLatestCommitSha
}

export async function uploadFiles(
	owner: string,
	repo: string,
	branch: string,
	files: readonly GitHubUploadFile[],
	latestCommitSha: string,
	commitMessage: string
): Promise<void> {
	// https://docs.github.com/en/rest/git/blobs#create-a-blob
	const blobUploadResponses = await Promise.all(
		files.map(file =>
			call(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
				method: "POST",
				body: JSON.stringify({
					encoding: "utf-8",
					content: file.contents,
				}),
			})
		)
	)

	// https://docs.github.com/en/rest/git/trees#create-a-tree
	const tree: any[] = []
	for (let i = 0; i < files.length; i++) {
		tree[i] = {
			path: files[i].path,
			type: "blob",
			mode: GitBlobModes.File,
			sha: blobUploadResponses[i].sha,
		}
	}
	const treeSha = (
		await call(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
			method: "POST",
			body: JSON.stringify({
				base_tree: latestCommitSha,
				tree: tree,
			}),
		})
	).sha

	// https://docs.github.com/en/rest/git/commits#create-a-commit
	const newCommitSha: string = (
		await call(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
			method: "POST",
			body: JSON.stringify({
				message: commitMessage,
				tree: treeSha,
				parents: [latestCommitSha],
			}),
		})
	).sha

	// https://docs.github.com/en/rest/git/refs#update-a-reference
	await call(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
		method: "PATCH",
		body: JSON.stringify({
			sha: newCommitSha,
		}),
	})
}

export async function createPullRequest(
	owner: string,
	repo: string,
	branchFrom: string,
	branchTo: string,
	title: string,
	body: string
): Promise<[string, number]> {
	// https://docs.github.com/en/rest/pulls/pulls#create-a-pull-request
	const pullRequest = await call(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
		method: "POST",
		body: JSON.stringify({
			title: title,
			body: body,
			head: branchFrom,
			base: branchTo,
		}),
	})

	return [pullRequest.html_url, pullRequest.number]
}

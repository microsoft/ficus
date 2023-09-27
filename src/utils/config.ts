"use client"

const ManifestPathStorageKey = "Manifest path"
let ManifestPath: string | null = "localStorage" in globalThis ? localStorage.getItem(ManifestPathStorageKey) : null

export function getManifestPath() {
	return ManifestPath
}

export function setManifestPath(token: string | null) {
	if (token) {
		ManifestPath = token
		localStorage.setItem(ManifestPathStorageKey, token)
	} else {
		ManifestPath = null
		localStorage.removeItem(ManifestPathStorageKey)
	}
}

const FigmaAccessTokenStorageKey = "Figma access token"
let FigmaAccessToken: string | null = "localStorage" in globalThis ? localStorage.getItem(FigmaAccessTokenStorageKey) : null

export function getFigmaAccessToken() {
	return FigmaAccessToken
}

export function setFigmaAccessToken(token: string | null) {
	if (token) {
		FigmaAccessToken = token
		localStorage.setItem(FigmaAccessTokenStorageKey, token)
	} else {
		FigmaAccessToken = null
		localStorage.removeItem(FigmaAccessTokenStorageKey)
	}
}

const GitHubAccessTokenStorageKey = "GitHub access token"
let GitHubAccessToken: string | null = "localStorage" in globalThis ? localStorage.getItem(GitHubAccessTokenStorageKey) : null

export function getGitHubAccessToken() {
	return GitHubAccessToken
}

export function setGitHubAccessToken(token: string | null) {
	if (token) {
		GitHubAccessToken = token
		localStorage.setItem(GitHubAccessTokenStorageKey, token)
	} else {
		GitHubAccessToken = null
		localStorage.removeItem(GitHubAccessTokenStorageKey)
	}
}

export function isProperlyConfigured(): boolean {
	return !!(ManifestPath && FigmaAccessToken && GitHubAccessToken)
}

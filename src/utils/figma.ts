import type {
	FileVariablesLocalResponse,
	FileVariablesLocalResponseMeta,
	FileVariablesPublishedResponse,
	FileVariablesPublishedResponseMeta,
} from "@/types/figma"
import type { Project } from "@/projects"
import { mergeRequestInit } from "./fetch"

/** Given a Figma share URL, returns the file's key for passing to APIs, or null if one is not available. */
export function getFileKeyFromFigmaUrl(url: string): string | null {
	try {
		const urlParts = new URL(url)
		if (urlParts.host !== "figma.com" && urlParts.host !== "www.figma.com") return null
		const results = /^\/file\/([^/]+)/.exec(urlParts.pathname)
		return results ? results[1] : null
	} catch {
		// If the string they passed in isn't a valid URL, but it doesn't contain any slashes or question marks, assume it's a key.
		return url.indexOf("/") < 0 && url.indexOf("?") < 0 ? url : null
	}
}

function toHex2(num: number): string {
	return Math.round(num * 0xff)
		.toString(16)
		.padStart(2, "0")
}

interface FigmaRGBA {
	r: number
	g: number
	b: number
	a?: number
}

export function figmaColorToTokenJsonColor(rgba: FigmaRGBA): string {
	return `#${toHex2(rgba.r)}${toHex2(rgba.g)}${toHex2(rgba.b)}${rgba.a !== undefined && rgba.a < 1.0 ? toHex2(rgba.a) : ""}`
}

async function call(project: Pick<Project, "figma">, url: string, options?: RequestInit): Promise<any> {
	const response = await fetch(
		url,
		mergeRequestInit(
			{
				method: "GET",
				headers: [
					["Accept", "application/json"],
					["X-Figma-Token", project.figma.accessToken],
				],
				next: {
					revalidate: 0, // disable Next.js caching
				},
			},
			options
		)
	)
	const data = await response.json()
	if (data.error) throw new Error(data.message)

	return data
}

/** Given a Figma key, returns the file's friendly name and other metadata. */
export async function getFigmaFileMetadata(
	project: Pick<Project, "figma">,
	fileKey: string
): Promise<{ name: string; thumbnailUrl?: string }> {
	const key = getFileKeyFromFigmaUrl(fileKey)
	if (!key) throw new Error(`Invalid Figma file key: ${fileKey}`)
	const data = await call(project, `https://api.figma.com/v1/files/${key}?depth=1`)
	return { name: data.name, thumbnailUrl: data.thumbnailUrl }
}

/** Given a Figma key, returns a list of all of the local and imported variable collections in the file. */
export async function getFigmaFileVariables(project: Pick<Project, "figma">, fileKey: string): Promise<FileVariablesLocalResponseMeta> {
	const key = getFileKeyFromFigmaUrl(fileKey)
	if (!key) throw new Error(`Invalid Figma file key: ${fileKey}`)
	const data: FileVariablesLocalResponse = await call(project, `https://api.figma.com/v1/files/${key}/variables/local`)
	return data.meta
}

/** Given a Figma key, returns a list of all of the published variables in the file. Note that the set of information is slightly different than for the local variables query. */
export async function getFigmaFilePublishedVariables(
	project: Pick<Project, "figma">,
	fileKey: string
): Promise<FileVariablesPublishedResponseMeta> {
	const key = getFileKeyFromFigmaUrl(fileKey)
	if (!key) throw new Error(`Invalid Figma file key: ${fileKey}`)
	const data: FileVariablesPublishedResponse = await call(project, `https://api.figma.com/v1/files/${key}/variables/published`)
	return data.meta
}

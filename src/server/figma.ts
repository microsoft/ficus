import type {
	FileVariablesLocalResponse,
	FileVariablesLocalResponseMeta,
	FileVariablesPublishedResponse,
	FileVariablesPublishedResponseMeta,
} from "@/types/figma"
import { getFigmaAccessToken } from "../utils/config"
import { mergeRequestInit } from "./utils/fetch"
import { getFileKeyFromFigmaUrl } from "./utils/figma"

async function call(url: string, options?: RequestInit): Promise<any> {
	const figmaAccessToken = getFigmaAccessToken()
	if (!figmaAccessToken) throw new Error("Can't call APIs without authentication")
	const response = await fetch(
		url,
		mergeRequestInit(
			{
				method: "GET",
				headers: [
					["Accept", "application/json"],
					["X-Figma-Token", figmaAccessToken],
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

/** Given a Figma key, returns the file's friendly name. */
export async function getFigmaFileFriendlyName(fileKey: string): Promise<string> {
	const key = getFileKeyFromFigmaUrl(fileKey)
	if (!key) throw new Error(`Invalid Figma file key: ${fileKey}`)
	const data = await call(`https://api.figma.com/v1/files/${key}?depth=1`)
	return data.name
}

/** Given a Figma key, returns a list of all of the local and imported variable collections in the file. */
export async function getFigmaFileVariables(fileKey: string): Promise<FileVariablesLocalResponseMeta> {
	const key = getFileKeyFromFigmaUrl(fileKey)
	if (!key) throw new Error(`Invalid Figma file key: ${fileKey}`)
	const data: FileVariablesLocalResponse = await call(`https://api.figma.com/v1/files/${key}/variables/local`)
	return data.meta
}

/** Given a Figma key, returns a list of all of the published variables in the file. Note that the set of information is slightly different than for the local variables query. */
export async function getFigmaFilePublishedVariables(fileKey: string): Promise<FileVariablesPublishedResponseMeta> {
	const key = getFileKeyFromFigmaUrl(fileKey)
	if (!key) throw new Error(`Invalid Figma file key: ${fileKey}`)
	const data: FileVariablesPublishedResponse = await call(`https://api.figma.com/v1/files/${key}/variables/published`)
	return data.meta
}

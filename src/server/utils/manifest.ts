import fs from "fs/promises"
import type { JsonManifest } from "@/types/manifest"

export async function loadManifestFile(path: string): Promise<JsonManifest> {
	return loadManifest((await fs.readFile(path)).toString())
}

export function loadManifest(json: string): JsonManifest {
	const manifest = JSON.parse(json)
	if (!("name" in manifest && "github" in manifest && "figma" in manifest))
		throw new Error("Manifest file was not in the correct format.")
	return manifest
}

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

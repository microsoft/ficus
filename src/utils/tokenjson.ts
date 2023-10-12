export type JsonTokenDocument = JsonTokenChildren & {
	$schema?: string
}

export type JsonTokenGroup = JsonTokenChildren & {
	$description?: string
}

export interface JsonTokenChildren {
	[name: string]: JsonTokenGroup | JsonToken
}

export type JsonTokenValue = any

export interface JsonToken {
	$type: JsonTokenType
	$value: JsonTokenValue
	$description?: string
	$extensions?: Record<string, any>
}

type JsonTokenPrimitiveType = "string" | "number" | "boolean" | "object" | "array" | "null"
type JsonTokenBasicType = "color" | "dimension" | "fontFamily" | "fontWeight" | "duration" | "cubicBezier"
type JsonTokenCompositeType = "strokeStyle" | "border" | "transition" | "shadow" | "gradient" | "typography"
export type JsonTokenType = JsonTokenPrimitiveType | JsonTokenBasicType | JsonTokenCompositeType

export function getFriendlyTokenJSON(tokens: JsonTokenDocument, sort: boolean) {
	return `${JSON.stringify(removeAllTokenPlaceholders(tokens) || {}, sort ? sortedPropertiesReplacer : undefined, "\t")}\n`

	function sortedPropertiesReplacer(key: string, value: any): any {
		if (typeof value !== "object" || Array.isArray(value)) return value

		return Object.keys(value)
			.sort(tokenNameComparer)
			.reduce((previous, propName) => {
				previous[propName] = value[propName]
				return previous
			}, {} as any)
	}

	function tokenNameComparer(a: string, b: string): number {
		// JSON.stringify requires numbers to always come first
		// After that, Global
		if (a === "Global") return -1
		else if (b === "Global") return 1

		// Then Shade#, sorted in DESCENDING order
		const shadeRegex = /^Shade(\d+)$/
		const shadeA = shadeRegex.exec(a)
		const shadeB = shadeRegex.exec(b)
		if (shadeA !== null && shadeB !== null) return parseInt(shadeB[1], 10) - parseInt(shadeA[1], 10)
		else if (shadeA !== null) return -1
		else if (shadeB !== null) return 1

		// Then Primary
		if (a === "Primary") return -1
		else if (b === "Primary") return 1

		// Then Tint#, sorted in ascending order
		const tintRegex = /^Tint(\d+)$/
		const tintA = tintRegex.exec(a)
		const tintB = tintRegex.exec(b)
		if (tintA !== null && tintB !== null) return parseInt(tintA[1], 10) - parseInt(tintB[1], 10)
		else if (tintA !== null) return -1
		else if (tintB !== null) return 1

		// Then known states
		if (a === "Rest") return -1
		else if (b === "Rest") return 1
		if (a === "Hover") return -1
		else if (b === "Hover") return 1
		if (a === "Pressed") return -1
		else if (b === "Pressed") return 1
		if (a === "Disabled") return -1
		else if (b === "Disabled") return 1
		if (a === "Selected") return -1
		else if (b === "Selected") return 1

		// Anything that parses to a number, sorted numerically
		// (This is ALMOST nonfunctional since JSON.stringify always sorts numbers to the top, but JSON.stringify's logic
		// doesn't count "05" as a number, so while we can't sort 05 numerically, at least put it before all other random strings.)
		const intA = parseInt(a, 10)
		const intB = parseInt(b, 10)
		if (intA !== intA && intB === intB) return 1
		else if (intB !== intB && intA === intA) return -1
		else if (intA !== intB) return intA - intB

		// Any other string, sorted alphabetically
		return a < b ? -1 : 1
	}
}

const DeletedToken = Symbol("Deleted token")

/** Takes a token document and returns a copy with all values removed and replaced with a placeholder. */
export function replaceAllTokensWithPlaceholders<T extends JsonTokenChildren>(tokens: JsonTokenChildren): T {
	const copy: any = {}
	for (const childName in tokens) {
		if (typeof childName === "symbol") continue
		if (childName.startsWith("$")) continue
		const child = tokens[childName]
		if (typeof child === "object") {
			if ("$value" in child) {
				copy[childName] = DeletedToken as any
			} else {
				const replaced = replaceAllTokensWithPlaceholders(child)
				copy[childName] = replaced
			}
		} else {
			copy[childName] = child
		}
	}
	return copy
}

/** Takes a token document, potentially with placeholders added by removeAllTokens, and strips out all placeholders. */
export function removeAllTokenPlaceholders(tokens: JsonTokenDocument): JsonTokenDocument {
	return removeAllTokenPlaceholdersCore(tokens) || {}
}

function removeAllTokenPlaceholdersCore<T extends JsonTokenChildren>(tokens: JsonTokenGroup): T | undefined {
	const copy: any = {}
	let hasChild = false
	for (const childName in tokens) {
		if (typeof childName === "symbol") continue
		const child = tokens[childName]
		if (typeof child === "symbol") {
			continue
		} else if (typeof child === "object") {
			if ("$value" in child) {
				copy[childName] = structuredClone(child)
				hasChild = true
			} else {
				const replaced = removeAllTokenPlaceholdersCore(child)
				if (replaced !== undefined) {
					copy[childName] = replaced
					hasChild = true
				}
			}
		} else {
			copy[childName] = child
			hasChild = true
		}
	}
	return hasChild ? copy : undefined
}

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

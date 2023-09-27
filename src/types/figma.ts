export interface FileVariablesLocalResponse {
	readonly meta: FileVariablesLocalResponseMeta
}

export interface FileVariablesLocalResponseMeta {
	readonly variables: { [variableId: string]: Readonly<FileVariablesLocalResponseVariable> }
	readonly variableCollections: { [variableCollectionId: string]: Readonly<FileVariablesLocalResponseVariableCollection> }
}

export type VariableType = "BOOLEAN" | "FLOAT" | "STRING" | "COLOR"

export type VariableScope = FloatVariableScope | ColorVariableScope
export type FloatVariableScope = "ALL_SCOPES" | "TEXT_CONTENT" | "WIDTH_HEIGHT" | "GAP" | "CORNER_RADIUS"
export type ColorVariableScope = "ALL_SCOPES" | "ALL_FILLS" | "FRAME_FILL" | "SHAPE_FILL" | "TEXT_FILL" | "STROKE_COLOR"

export interface VariableCodeSyntax {
	WEB?: string
	ANDROID?: string
	iOS?: string
}

export interface FileVariablesLocalResponseVariable {
	id: string
	name: string
	key: string
	variableCollectionId: string
	resolvedType: VariableType
	valuesByMode: { readonly [modeId: string]: any }
	remote: boolean
	description: string
	hiddenFromPublishing: boolean
	scopes: readonly VariableScope[]
	codeSyntax: VariableCodeSyntax
}

export interface FileVariablesLocalResponseVariableCollection {
	id: string
	name: string
	modes: readonly { modeId: string; name: string }[]
	defaultModeId: string
	key: string
	remote: boolean
	hiddenFromPublishing: boolean
}

export const enum ValueType {
	Alias = "VARIABLE_ALIAS",
}

export interface FileVariablesLocalResponseVariableValueAlias {
	type: ValueType.Alias
	id: string
}

export interface FileVariablesPublishedResponse {
	meta: FileVariablesPublishedResponseMeta
}

export interface FileVariablesPublishedResponseMeta {
	variables: { [variableId: string]: Readonly<FileVariablesPublishedResponseVariable> }
	variableCollections: { [variableCollectionId: string]: Readonly<FileVariablesPublishedResponseVariableCollection> }
}

export interface FileVariablesPublishedResponseVariable {
	id: string
	subscribed_id: string
	name: string
	key: string
	variableCollectionId: string
	resolvedDataType: VariableType // TODO: will be renamed to resolvedType in a future API version
}

export interface FileVariablesPublishedResponseVariableCollection {
	id: string
	subscribed_id: string
	name: string
	key: string
}

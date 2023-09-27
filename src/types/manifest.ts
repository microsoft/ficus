export interface JsonManifest {
	name: string
	figma: JsonFigma
}

export interface JsonFigma {
	files: JsonFigmaFile[]
}

export interface JsonFigmaFile {
	key: string
	collections: { [name: string]: JsonFigmaCollection }
}

export interface JsonFigmaCollection {
	modes: { [name: string]: string[] }
}

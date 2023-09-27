export type RepoContentsResponse = readonly RepoContentsResponseFile[]

export interface RepoContentsResponseFile {
	readonly name: string
	readonly path: string
	readonly size: number
}

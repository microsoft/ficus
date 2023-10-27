type OperationProgress = "none" | "busy" | "done" | "error"

export interface CreatePullRequestStatus {
	title: string
	progress: OperationProgress
	legacyStatus: string[]
	steps: CreatePullRequestStep[]
}

interface CreatePullRequestStepBase {
	type: string
	progress: OperationProgress
	substeps: CreatePullRequestSubstep[]
}

export interface CreatePullRequestGitHubStep extends CreatePullRequestStepBase {
	type: "github"
	owner: string
	repo: string
	branch: string
	filename: string
}

export interface CreatePullRequestFigmaStep extends CreatePullRequestStepBase {
	type: "figma"
	title: string
	variablesCount: number
}

export interface CreatePullRequestCompletedStep extends CreatePullRequestStepBase {
	type: "completed"
	branch: string
	number: number
	url: string
}

export interface CreatePullRequestFailedStep extends CreatePullRequestStepBase {
	type: "failed"
}

export type CreatePullRequestStep =
	| CreatePullRequestGitHubStep
	| CreatePullRequestFigmaStep
	| CreatePullRequestCompletedStep
	| CreatePullRequestFailedStep

interface CreatePullRequestSubstepBase {
	type: string
}

export interface CreatePullRequestError extends CreatePullRequestSubstepBase {
	type: "error"
	message: string
}

export interface CreatePullRequestMappingSubstep extends CreatePullRequestSubstepBase {
	type: "file mapping"
	figma: string
	github: string[]
}

export type CreatePullRequestSubstep = CreatePullRequestError | CreatePullRequestMappingSubstep

const _sampleStatus: CreatePullRequestStatus = {
	title: "Creating pull request...",
	progress: "busy",
	legacyStatus: [],
	steps: [
		{
			type: "github",
			progress: "done",
			owner: "travisspomer",
			repo: "TokensTestRepo",
			branch: "main",
			filename: "src/ficus.json",
			substeps: [],
		},
		{
			type: "figma",
			progress: "done",
			title: "Fluent 2 design language",
			variablesCount: 920,
			substeps: [{ type: "file mapping", figma: "Global tokens, Value", github: ["global.json", "global.brand.json"] }],
		},
		{
			type: "figma",
			progress: "busy",
			title: "Fluent 2 web variables",
			variablesCount: 263,
			substeps: [
				{ type: "file mapping", figma: "Web React tokens, Light", github: ["light.json"] },
				{ type: "file mapping", figma: "Web React tokens, Dark", github: ["dark.json"] },
			],
		},
	],
}

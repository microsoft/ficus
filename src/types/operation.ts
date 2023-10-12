interface CreatePullRequestOperation {
	status: CreatePullRequestStatus
	state: CreatePullRequestState
}

type FigmaFileData = symbol // *** JUST FOR DEVELOPING THE TYPES; MERGE WITH PAGE.TSX

type OperationProgress = "none" | "busy" | "done" | "error"

interface CreatePullRequestStatus {
	title: string
	progress: OperationProgress
	steps: CreatePullRequestStep[]
}

interface CreatePullRequestStepBase {
	type: string
	progress: OperationProgress
	substeps: CreatePullRequestSubstep[]
}

interface CreatePullRequestGitHubStep extends CreatePullRequestStepBase {
	type: "github"
	owner: string
	repo: string
	branch: string
	filename: string
}

interface CreatePullRequestFigmaStep extends CreatePullRequestStepBase {
	type: "figma"
	title: string
	variablesCount: number
}

interface CreatePullRequestCompletedStep extends CreatePullRequestStepBase {
	type: "completed"
	branch: string
	number: number
	url: string
}

interface CreatePullRequestFailedStep extends CreatePullRequestStepBase {
	type: "failed"
}

type CreatePullRequestStep =
	| CreatePullRequestGitHubStep
	| CreatePullRequestFigmaStep
	| CreatePullRequestCompletedStep
	| CreatePullRequestFailedStep

interface CreatePullRequestSubstepBase {
	type: string
}

interface CreatePullRequestError extends CreatePullRequestSubstepBase {
	type: "error"
	message: string
}

interface CreatePullRequestMappingSubstep extends CreatePullRequestSubstepBase {
	type: "file mapping"
	figma: string
	github: string[]
}

type CreatePullRequestSubstep = CreatePullRequestError | CreatePullRequestMappingSubstep

interface CreatePullRequestState {
	data: FigmaFileData[]
}

const _sampleStatus: CreatePullRequestStatus = {
	title: "Creating pull request...",
	progress: "busy",
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

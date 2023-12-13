export type OperationProgress = "none" | "busy" | "done" | "error"

export interface CreatePullRequestStatus {
	title: string
	projectTitle: string
	progress: OperationProgress
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
	number: number | null
	url: string | null
	draft: boolean
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

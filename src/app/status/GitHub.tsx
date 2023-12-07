import React from "react"
import { CreatePullRequestGitHubStep } from "@/types/operation"
import Step from "./Step"

export function GitHub(props: CreatePullRequestGitHubStep & { isLast: boolean }) {
	return (
		<Step title={`${props.owner}/\u200b${props.repo}`} progress={props.progress} substeps={props.substeps} isLast={props.isLast}>
			<li>
				{props.filename} on {props.branch} branch
			</li>
		</Step>
	)
}
export default GitHub

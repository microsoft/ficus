import React from "react"
import Icon from "@/assets/github.svg"
import { CreatePullRequestGitHubStep } from "@/types/operation"
import Step from "./Step"

export function GitHub(props: CreatePullRequestGitHubStep) {
	return (
		<Step icon={<Icon />} progress={props.progress} substeps={props.substeps}>
			<p>{props.owner}/</p>
			<h2>{props.repo}</h2>
			<p>{props.branch}</p>
			<p>{props.filename}</p>
		</Step>
	)
}
export default GitHub

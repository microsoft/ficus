import React from "react"
import styles from "./GitHub.module.css"
import { CreatePullRequestGitHubStep } from "@/types/operation"
import Step from "./Step"

export function GitHub(props: CreatePullRequestGitHubStep) {
	return (
		<Step progress={props.progress} title={props.repo} substeps={props.substeps}>
			<p>{props.branch}</p>
			<p>{props.filename}</p>
		</Step>
	)
}
export default GitHub

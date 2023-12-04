import React from "react"
import Icon from "@/assets/github.svg"
import { Title3, Body1 } from "@fluentui/react-components"
import { CreatePullRequestGitHubStep } from "@/types/operation"
import Step from "./Step"

export function GitHub(props: CreatePullRequestGitHubStep) {
	return (
		<Step icon={<Icon />} progress={props.progress} substeps={props.substeps}>
			<Body1 as="p" block>
				{props.owner}/
			</Body1>
			<Title3 as="h2" block>
				{props.repo}
			</Title3>
			<Body1 as="p" block>
				{props.branch}
			</Body1>
			<Body1 as="p" block>
				{props.filename}
			</Body1>
		</Step>
	)
}
export default GitHub

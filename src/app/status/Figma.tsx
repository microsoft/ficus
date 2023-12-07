import React from "react"
import { Title3, Body1 } from "@fluentui/react-components"
import { CreatePullRequestFigmaStep } from "@/types/operation"
import Step from "./Step"

export function Figma(props: CreatePullRequestFigmaStep & { isLast: boolean }) {
	return (
		<Step progress={props.progress} title={props.title} substeps={props.substeps} isLast={props.isLast}>
			<li>{props.progress !== "busy" ? `${props.variablesCount} variables` : "Syncing variables..."}</li>
		</Step>
	)
}
export default Figma

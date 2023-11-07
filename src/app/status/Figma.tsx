import React from "react"
import Icon from "@/assets/figma.svg"
import { CreatePullRequestFigmaStep } from "@/types/operation"
import Step from "./Step"

export function Figma(props: CreatePullRequestFigmaStep) {
	return (
		<Step icon={<Icon />} progress={props.progress} substeps={props.substeps}>
			<h2>{props.title}</h2>
			{props.variablesCount > 0 ? `${props.variablesCount} variables` : null}
		</Step>
	)
}
export default Figma

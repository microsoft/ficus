import React from "react"
import Icon from "@/assets/figma.svg"
import { Title3, Body1 } from "@fluentui/react-components"
import { CreatePullRequestFigmaStep } from "@/types/operation"
import Step from "./Step"

export function Figma(props: CreatePullRequestFigmaStep) {
	return (
		<Step icon={<Icon />} progress={props.progress} substeps={props.substeps}>
			<Title3 as="h2" block>
				{props.title}
			</Title3>
			<Body1 as="p" block>
				{props.variablesCount > 0 ? `${props.variablesCount} variables` : null}
			</Body1>
		</Step>
	)
}
export default Figma

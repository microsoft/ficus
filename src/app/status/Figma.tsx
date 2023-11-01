import React from "react"
import styles from "./Figma.module.css"
import { CreatePullRequestFigmaStep } from "@/types/operation"
import Step from "./Step"

export function Figma(props: CreatePullRequestFigmaStep) {
	return (
		<Step progress={props.progress} title={props.title} substeps={props.substeps}>
			{props.variablesCount > 0 ? `${props.variablesCount} variables` : null}
		</Step>
	)
}
export default Figma

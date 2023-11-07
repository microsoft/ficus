import React from "react"
import { CreatePullRequestFailedStep } from "@/types/operation"
import Step from "./Step"

export function Failed(props: CreatePullRequestFailedStep) {
	return (
		<Step progress={props.progress} substeps={props.substeps}>
			<h2>Oops</h2>
		</Step>
	)
}
export default Failed

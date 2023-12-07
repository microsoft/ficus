import React from "react"
import { Title3, Body1 } from "@fluentui/react-components"
import { CreatePullRequestFailedStep } from "@/types/operation"
import Step from "./Step"

export function Failed(props: CreatePullRequestFailedStep & { isLast: boolean }) {
	return (
		<Step progress={props.progress} substeps={props.substeps} isLast={props.isLast}>
			<Title3 as="h2" block>
				Oops
			</Title3>
			<Body1 as="p" block>
				Something went wrong.
			</Body1>
		</Step>
	)
}
export default Failed

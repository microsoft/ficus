import React from "react"
import Link from "next/link"
import { CreatePullRequestCompletedStep } from "@/types/operation"
import Step from "./Step"

export function Completed(props: CreatePullRequestCompletedStep) {
	return (
		<Step
			progress={props.progress}
			title={props.number ? `Pull request #${props.number}` : "Opening pull request"}
			substeps={props.substeps}
		>
			{props.url && (
				<Link href={props.url} target="_blank">
					Open pull request #{props.number}
				</Link>
			)}
		</Step>
	)
}
export default Completed

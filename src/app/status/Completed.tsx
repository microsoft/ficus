import React from "react"
import Link from "next/link"
import { CreatePullRequestCompletedStep } from "@/types/operation"
import Step from "./Step"

export function Completed(props: CreatePullRequestCompletedStep) {
	return (
		<Step
			progress={props.progress}
			title={props.number ? `Pull request #${props.number} opened` : "Opening pull request"}
			substeps={props.substeps}
		>
			{props.url && (
				<>
					<p>Ready for review!</p>
					<p>
						<Link href={props.url} target="_blank">
							Open in new tab
						</Link>
					</p>
				</>
			)}
		</Step>
	)
}
export default Completed

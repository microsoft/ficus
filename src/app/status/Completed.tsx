import React from "react"
import Link from "next/link"
import Icon from "@/assets/github.svg"
import { CreatePullRequestCompletedStep } from "@/types/operation"
import Step from "./Step"

export function Completed(props: CreatePullRequestCompletedStep) {
	return (
		<Step icon={<Icon />} progress={props.progress} substeps={props.substeps}>
			{props.url ? (
				<>
					<h2>Pull request #{props.number} opened</h2>
					<p>Ready for review!</p>
					<p>
						<Link href={props.url} target="_blank">
							Open in new tab
						</Link>
					</p>
				</>
			) : (
				<h2>Opening pull request</h2>
			)}
		</Step>
	)
}
export default Completed

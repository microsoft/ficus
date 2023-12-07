import React from "react"
import { Body1 } from "@fluentui/react-components"
import { LinkButton } from "@/components/LinkButton"
import { CreatePullRequestCompletedStep } from "@/types/operation"
import Step from "./Step"

export function Completed(props: CreatePullRequestCompletedStep & { isLast: boolean }) {
	return (
		<Step
			progress={props.progress}
			title={props.url ? `Pull request #${props.number}` : "Opening pull request"}
			substeps={props.substeps}
			isLast={props.isLast}
		>
			{props.number && <li>Opened and ready for review</li>}
			{props.url && (
				<Body1 as="p" block>
					<LinkButton href={props.url} target="_blank" appearance="primary" size="large">
						View pull request
					</LinkButton>
				</Body1>
			)}
		</Step>
	)
}
export default Completed

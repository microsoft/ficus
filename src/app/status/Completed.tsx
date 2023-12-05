import React from "react"
import { Title3, Body1 } from "@fluentui/react-components"
import { LinkButton } from "@/components/LinkButton"
import Icon from "@/assets/github.svg"
import { CreatePullRequestCompletedStep } from "@/types/operation"
import Step from "./Step"

export function Completed(props: CreatePullRequestCompletedStep) {
	return (
		<Step icon={<Icon />} progress={props.progress} substeps={props.substeps}>
			{props.url ? (
				<>
					<Title3 as="h2" block>
						Pull request #{props.number} opened
					</Title3>
					<Body1 as="p" block>
						Ready for review!
					</Body1>
					<Body1 as="p" block>
						<LinkButton href={props.url} target="_blank" appearance="primary" size="large">
							Open in new tab
						</LinkButton>
					</Body1>
				</>
			) : (
				<Title3 as="h2" block>
					Opening pull request
				</Title3>
			)}
		</Step>
	)
}
export default Completed

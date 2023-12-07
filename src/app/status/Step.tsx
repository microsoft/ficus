import React from "react"
import styles from "./Step.module.css"
import { Spinner, Title3 } from "@fluentui/react-components"
import Checkmark from "@/assets/checkmark.svg"
import NoEntry from "@/assets/noentry.svg"
import { CreatePullRequestSubstep, OperationProgress } from "@/types/operation"
import FileMappingSubstep from "./FileMappingSubstep"
import ErrorSubstep from "./ErrorSubstep"

export interface StepProps {
	progress: OperationProgress
	title?: string
	substeps: CreatePullRequestSubstep[]
	children?: React.ReactNode | React.ReactNode[]
	isLast: boolean
}

export function Step(props: StepProps) {
	return (
		<li className={styles.root}>
			<div className={styles.progress}>
				{props.progress === "busy" ? (
					<Spinner size="small" />
				) : props.progress === "error" ? (
					<NoEntry />
				) : props.progress === "done" ? (
					<Checkmark />
				) : null}
				{!props.isLast && <div className={styles.timeline}></div>}
			</div>
			<div className={styles.card}>
				<ul className={styles.cardcontent}>
					{props.title && (
						<Title3 as="h2" block>
							{props.title}
						</Title3>
					)}
					<ul className={styles.substeps}>
						{props.children}
						{props.substeps.length > 0 &&
							props.substeps.map((substep, index) =>
								substep.type === "file mapping" ? (
									<FileMappingSubstep key={`substep${index}`} {...substep} />
								) : substep.type === "error" ? (
									<ErrorSubstep key={`substep${index}`} {...substep} />
								) : (
									`Unknown detail: ${(substep as any).type}`
								)
							)}
					</ul>
				</ul>
				{!props.isLast && <div className={styles.betweencards}></div>}
			</div>
		</li>
	)
}
export default Step

import React from "react"
import styles from "./Step.module.css"
import { Card } from "@fluentui/react-components"
import Checkmark from "@/assets/checkmark.svg"
import NoEntry from "@/assets/noentry.svg"
import Spinner from "@/assets/spinner.svg"
import { CreatePullRequestSubstep, OperationProgress } from "@/types/operation"
import FileMappingSubstep from "./FileMappingSubstep"
import ErrorSubstep from "./ErrorSubstep"

export interface StepProps {
	progress: OperationProgress
	icon?: React.ReactNode
	substeps: CreatePullRequestSubstep[]
	children?: React.ReactNode | React.ReactNode[]
}

export function Step(props: StepProps) {
	return (
		<li className={styles.root}>
			<span className={styles.progress}>
				{props.progress === "busy" ? (
					<Spinner className={styles.spinner} />
				) : props.progress === "error" ? (
					<NoEntry />
				) : props.progress === "done" ? (
					<Checkmark />
				) : null}
			</span>
			<div className={styles.card}>
				<Card size="large">
					<div className={styles.cardcontent}>{props.children}</div>
					{props.icon && <div className={styles.icon}>{props.icon}</div>}
				</Card>
			</div>
			{props.substeps.length > 0 && (
				<ul className={styles.substeps}>
					{props.substeps.map((substep, index) =>
						substep.type === "file mapping" ? (
							<FileMappingSubstep key={`substep${index}`} {...substep} />
						) : substep.type === "error" ? (
							<ErrorSubstep key={`substep${index}`} {...substep} />
						) : (
							`Unknown detail: ${(substep as any).type}`
						)
					)}
				</ul>
			)}
		</li>
	)
}
export default Step

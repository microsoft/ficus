import React from "react"
import styles from "./Step.module.css"
import { CreatePullRequestSubstep, OperationProgress } from "@/types/operation"
import FileMappingSubstep from "./FileMappingSubstep"
import ErrorSubstep from "./ErrorSubstep"

export interface StepProps {
	progress: OperationProgress
	title: string
	substeps: CreatePullRequestSubstep[]
	children?: React.ReactNode | React.ReactNode[]
}

export function Step(props: StepProps) {
	return (
		<li className={styles.root}>
			{/* TODO: Add real progress and brand icons */}
			<span className={styles.progress}>
				{props.progress === "busy" ? "⌚" : props.progress === "error" ? "❌" : props.progress === "done" ? "✅" : ""}
			</span>
			<div className={styles.card}>
				<h2>{props.title}</h2>
				{props.children}
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

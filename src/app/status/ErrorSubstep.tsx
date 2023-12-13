import React from "react"
import styles from "./ErrorSubstep.module.css"
import { CreatePullRequestError } from "@/types/operation"

export function Error(props: CreatePullRequestError) {
	return (
		<li style={{ listStyleType: "'❌'" }} className={styles.error}>
			{props.message}
		</li>
	)
}
export default Error

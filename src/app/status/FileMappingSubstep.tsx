import React from "react"
import { CreatePullRequestMappingSubstep } from "@/types/operation"

export function FileMapping(props: CreatePullRequestMappingSubstep) {
	return (
		<li>
			{props.figma} → {props.github}
		</li>
	)
}
export default FileMapping

import React from "react"
import { CreatePullRequestFailedStep } from "@/types/operation"
import Step from "./Step"

export function Failed(props: CreatePullRequestFailedStep) {
	return <Step progress={props.progress} title="Oops" substeps={props.substeps}></Step>
}
export default Failed

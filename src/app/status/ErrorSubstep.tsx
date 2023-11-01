import React from "react"
import { CreatePullRequestError } from "@/types/operation"

export function Error(props: CreatePullRequestError) {
	return <li style={{ listStyleType: "❌" }}>{props.message}</li>
}
export default Error

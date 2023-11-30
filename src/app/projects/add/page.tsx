"use client"

import React from "react"
import styles from "./page.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Display, Title2, Body1, Button } from "@fluentui/react-components"
import { Content, ContentStack } from "@/components/ContentStack"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import type { Project } from "@/projects"
import { getProjectManager } from "@/projects"

export default function AddProject() {
	const router = useRouter()
	const [, forceUpdate] = React.useReducer(_ => !_, false)

	React.useEffect(() => {
		router.push("/settings")
	}, [router])

	return (
		<ContentStack>
			<Content>
				{/* <Display as="h1">Add a project</Display>
				<Body1 as="p" block>
					World's finest "add a project" page coming soon.
				</Body1>
				<Body1 as="p" block>
					For now, use the old <Link href="/settings">settings page</Link>.
				</Body1> */}
			</Content>
		</ContentStack>
	)
}

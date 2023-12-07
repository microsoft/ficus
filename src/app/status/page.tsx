"use client"

import React from "react"
import styles from "./page.module.css"
import { Display, Title2, Body1, Card } from "@fluentui/react-components"
import { Content } from "@/components/ContentStack"
import { useCreatePullRequest } from "@/operations/createPullRequest"
import Figma from "./Figma"
import GitHub from "./GitHub"
import Failed from "./Failed"
import Completed from "./Completed"
import { LinkButton } from "@/components/LinkButton"

export default function Status() {
	const [createPullRequestStatus, _createPullRequestOperations] = useCreatePullRequest()

	return (
		<>
			<Content>
				{createPullRequestStatus.progress !== "none" ? (
					<>
						<Display as="h1">{createPullRequestStatus.title}</Display>
						<div>
							<Title2 as="h2">{createPullRequestStatus.projectTitle}</Title2>
						</div>
						<div className={styles.card}>
							<Card size="large">
								<ul className={styles.cardcontent}>
									{createPullRequestStatus.steps.map((step, index) =>
										step.type === "github" ? (
											<GitHub
												key={`step${index}`}
												{...step}
												isLast={index === createPullRequestStatus.steps.length - 1}
											/>
										) : step.type === "figma" ? (
											<Figma
												key={`step${index}`}
												{...step}
												isLast={index === createPullRequestStatus.steps.length - 1}
											/>
										) : step.type === "failed" ? (
											<Failed
												key={`step${index}`}
												{...step}
												isLast={index === createPullRequestStatus.steps.length - 1}
											/>
										) : step.type === "completed" ? (
											<Completed
												key={`step${index}`}
												{...step}
												isLast={index === createPullRequestStatus.steps.length - 1}
											/>
										) : (
											`Unknown step type: ${(step as any).type}`
										)
									)}
								</ul>
							</Card>
						</div>
					</>
				) : (
					<>
						<Display as="h1">Ready!</Display>
						<Body1 as="p" block>
							This page will show the current status, once there's some current status to show.
						</Body1>
					</>
				)}
			</Content>
			<Content>
				<div className={styles.right}>
					<LinkButton appearance="outline" href="/">
						Back to my projects
					</LinkButton>
				</div>
			</Content>
		</>
	)
}

/*
	// Sample data
	const createPullRequestStatus: ReturnType<typeof useCreatePullRequest>[0] =
	{
		title: "Opening pull request",
		projectTitle: "Fluent 2 test repo",
		progress: "busy",
		steps: [
			{
				type: "github",
				progress: "done",
				owner: "TravisSpomer",
				repo: "TokensTestRepo",
				branch: "main",
				filename: "ficus.json",
				substeps: [],
			},
			{
				type: "figma",
				progress: "error",
				title: "Fluent 2 design language",
				variablesCount: 1113,
				substeps: [
					{
						type: "file mapping",
						figma: "Global: Value",
						github: ["global.json", "global.brand.json", "global.high-contrast.json"],
					},
				],
			},
			{
				type: "figma",
				progress: "busy",
				title: "Fluent web variables",
				variablesCount: 305,
				substeps: [
					{
						type: "file mapping",
						figma: "Color: Light",
						github: ["light.json"],
					},
					{
						type: "file mapping",
						figma: "Color: Dark",
						github: ["dark.json"],
					},
				],
			},
			{
				type: "completed",
				progress: "done",
				url: "http://localhost:3000/",
				number: 81,
				branch: "main",
				substeps: [],
			},
		],
	}
*/

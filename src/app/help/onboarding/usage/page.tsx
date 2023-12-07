"use client"

import React from "react"
import Link from "next/link"
import { Display, Title2, Body1 } from "@fluentui/react-components"
import { Content } from "@/components/ContentStack"

export default function OnboardingUsage() {
	return (
		<Content>
			<Display as="h1">Setting up Ficus and making your first pull request</Display>
			<Title2 as="h2" block>
				Adding a new project
			</Title2>
			<Body1 as="p" block>
				The first step is to <Link href="/projects/add">add a new project</Link>, which is how you tell Ficus where your files are
				and how they relate to each other. We’ll walk you through the whole process.
			</Body1>
			<Title2 as="h2" block>
				Creating your first pull request
			</Title2>
			<Body1 as="p" block>
				Once you’ve added a project, you’re ready to make your first pull request. Ficus will:
			</Body1>
			<ul>
				<li>Get your Figma variables</li>
				<li>Convert those variables into token JSON</li>
				<li>Open a pull request on GitHub of the changes you’ve made</li>
			</ul>
			<Body1 as="p" block>
				A pull request is like a request for a review: "hey, I made some changes to the code and I would like to have them
				reviewed." Except in this case, Ficus writes the code for you!
			</Body1>
			<Body1 as="p" block>
				Go back to the <a href="/">Ficus home page</a>, and then select <strong>Create a pull request</strong>. That’s it! When
				Ficus is done, it will give you a link to the pull request that it created with your changes. The engineers who manage that
				repo will be notified that there are new changes to review.
			</Body1>
			<Title2 as="h2" block>
				What if I make a mistake?
			</Title2>
			<Body1 as="p" block>
				Don’t worry: If you accidentally create a pull request that you don’t want, open it on GitHub using the link that Ficus
				gives you. There, you’ll see a "Close pull request" button. Just click that.
			</Body1>
			<Body1 as="p" block>
				At this time it’s not possible to update an existing pull request with new changes after it’s been opened. Close the
				original pull request, and then use Ficus to create a new one.
			</Body1>
			<Title2 as="h2" block>
				What if it doesn’t work?
			</Title2>
			<Body1 as="p" block>
				If you get an error message while creating the pull request, you’ll probably want to contact one of the engineers who works
				in that repo. Ficus won’t make any changes if it runs into trouble.
			</Body1>
			<Title2 as="h2" block>
				Tips
			</Title2>
			<Body1 as="p" block>
				Once Ficus is set up, avoid changing the names of your variable collections or modes. But if you do, just let your engineer
				partner know so that they can update the ficus.json file accordingly, or otherwise Ficus won’t be able to find those
				variables anymore.
			</Body1>
		</Content>
	)
}

"use client"

import React from "react"
import { Display, Title2, Body1 } from "@fluentui/react-components"
import { Content } from "@/components/ContentStack"

export default function OnboardingUsage() {
	return (
		<Content>
			<Display as="h1">Setting up Ficus and making your first pull request</Display>
			<Title2 as="h2" block>
				What you need
			</Title2>
			<Body1 as="p" block>
				Let's make sure you have everything you need:
			</Body1>
			<ul>
				<li>An account on GitHub.com</li>
				<li>
					A link to the ficus.json file for your repo
					<ul>
						<li>
							It will look something like this: <code>https://github.com/TravisSpomer/MyTokens/blob/main/src/ficus.json</code>
						</li>
						<li>
							If you don't already have that file set up, you can read through{" "}
							<strong>
								<a href="/help/onboarding/repo">Preparing your GitHub repo to work with Ficus</a>
							</strong>
							, or send that link to an engineer who works in that repo
						</li>
					</ul>
				</li>
			</ul>
			<Title2 as="h2" block>
				The settings page
			</Title2>
			<Body1 as="p" block>
				Go ahead and open up the{" "}
				<a href="/settings" target="_blank">
					settings page
				</a>{" "}
				in a new tab so you can reference this page and that one at the same time.
			</Body1>
			<Body1 as="p" block>
				The settings page needs a GitHub link to your repo's ficus.json file. Just copy and paste!
			</Body1>
			<Body1 as="p" block>
				Now for the complicated part: for your security, you'll need to get a Personal Access Token for Figma and another one for
				GitHub, and share those with Ficus.
			</Body1>
			<ul>
				<li>
					A Personal Access Token (PAT) is like a password—don't share it with anyone! Each person who uses Ficus will get their
					own PAT.
				</li>
				<li>A Personal Access Token has nothing to do with design tokens; it's just a coincidence.</li>
				<li>The Settings page gives you instructions on how to get a PAT.</li>
				<li>A PAT can be revoked and reset if you ever accidentally leak it, just like a password.</li>
			</ul>
			<Body1 as="p" block>
				Once you have your PATs, paste them into Ficus's settings page. Then click Save to save your settings.
			</Body1>
			<Body1 as="p" block>
				You only have to do all that once on each device that uses Ficus.
			</Body1>
			<Title2 as="h2" block>
				That's it!
			</Title2>
			<Body1 as="p" block>
				Now you're ready to make your first pull request. Ficus will:
			</Body1>
			<ul>
				<li>Get your Figma variables</li>
				<li>Convert those variables into token JSON</li>
				<li>Open a pull request on GitHub of the changes you've made</li>
			</ul>
			<Body1 as="p" block>
				A pull request is like a request for a review: "hey, I made some changes to the code and I would like to have them
				reviewed." Except in this case, Ficus writes the "code" for you!
			</Body1>
			<Body1 as="p" block>
				Go back to the <a href="/">Ficus home page</a> using the "Ficus" link at the top. You'll now see a button that says "
				<strong>Create a pull request</strong>". Click it and watch the magic happen! When it's done, it will give you a link to the
				pull request that it created with your changes. The engineers who manage that repo will be notified that there are new
				changes to review.
			</Body1>
			<Title2 as="h2" block>
				What if I make a mistake?
			</Title2>
			<Body1 as="p" block>
				Don't worry: If you accidentally create a pull request that you don't want, open it on GitHub using the link that Ficus
				gives you. There, you'll see a "Close pull request" button. Just click that.
			</Body1>
			<Body1 as="p" block>
				At this time it's not possible to update an existing pull request with new changes after it's been opened. Close the
				original pull request, and then use Ficus to create a new one.
			</Body1>
			<Title2 as="h2" block>
				What if it doesn't work?
			</Title2>
			<Body1 as="p" block>
				If you get an error message while creating the pull request, you'll probably want to contact one of the engineers who works
				in that repo. Ficus won't make any changes if it runs into trouble.
			</Body1>
			<Title2 as="h2" block>
				Tips
			</Title2>
			<Body1 as="p" block>
				Once Ficus is set up, avoid changing the names of your variable collections or modes. But if you do, just let your favorite
				engineer know so that they can update the ficus.json file accordingly, or otherwise Ficus won't be able to find those
				variables anymore.
			</Body1>
		</Content>
	)
}

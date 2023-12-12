"use client"

import React from "react"
import { Display, Title2, Body1, Body1Strong } from "@fluentui/react-components"
import { Content } from "@/components/ContentStack"

export default function Help() {
	return (
		<Content>
			<Display as="h1">What is Ficus?</Display>
			<Title2 as="h2" block>
				It’s an internal tool
			</Title2>
			<Body1 as="p" block>
				<Body1Strong>This is an internal tool from Microsoft Design and not supported or warranted in any way.</Body1Strong> No
				guarantees are made that this will work for you or even continue to be accessible, or that it will continue to be developed.
			</Body1>
			<Title2 as="h2" block>
				It connects variables in Figma to tokens in GitHub
			</Title2>
			<Body1 as="p" block>
				Ficus connects your variables in Figma to token JSON in GitHub. After <a href="/help/onboarding/repo">initial setup</a>:
			</Body1>
			<ol>
				<li>Make a change to one or more variables in Figma: say, making Color/Red darker</li>
				<li>Click the "Create a pull request" button in Ficus</li>
				<li>
					Ficus opens a pull request on GitHub containing the exact changes made to your variables: in this example, changing{" "}
					<code>Color.Red</code> from <code>#ff0000</code> to <code>#990000</code>.
				</li>
			</ol>
			<Body1 as="p" block>
				With Ficus, designers can make changes that would have previously required manual handoff to an engineer, and those changes
				integrate with the same systems for reviews and versioning and so on that engineers are already using.
			</Body1>
			<Title2 as="h2" block>
				What Ficus <em>isn’t</em>
			</Title2>
			<Body1 as="p" block>
				Ficus saves tokens in the{" "}
				<a href="https://tr.designtokens.org/" target="_blank">
					W3C Design Token Community Group draft format
				</a>
				. It doesn’t support other token file formats, does not work with design tools other than Figma, and does not work with
				tokens stored outside of GitHub. It does not transform token JSON into code (say, CSS variables).
			</Body1>
			<Title2 as="h2" block>
				How do I set it up?
			</Title2>
			<ul>
				<li>
					<a href="/help/onboarding/repo">Preparing your GitHub repo to work with Ficus</a> (mostly for engineers)
				</li>
				<li>
					<a href="/help/onboarding/usage">Setting up Ficus and making your first pull request</a> (mostly for designers)
				</li>
			</ul>
			<Title2 as="h2" block>
				Legal info
			</Title2>
			<Body1 as="p" block>
				Ficus is © 2023 Microsoft and developed by{" "}
				<a href="https://microsoft.design/" target="_blank">
					Microsoft Design
				</a>
				.{" "}
				<a href="https://go.microsoft.com/fwlink/?LinkID=206977" target="_blank">
					Terms of use
				</a>
				.{" "}
				<a href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank">
					Privacy
				</a>
				.{" "}
				<a href="https://github.com/microsoft/ficus" target="_blank">
					Code on GitHub
				</a>
				.
			</Body1>
		</Content>
	)
}

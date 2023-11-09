"use client"

import React from "react"
import { Content } from "@/components/ContentStack"

export default function Help() {
	return (
		<Content>
			<h1>What is Ficus?</h1>
			<h2>It's an internal tool</h2>
			<p>
				<strong>This is an internal tool and not supported or warranted in any way.</strong> No guarantees are made that this will
				work for you or even continue to be accessible, or that it will continue to be developed.
			</p>
			<h2>It connects variables in Figma to tokens in GitHub</h2>
			<p>
				Ficus connects your variables in Figma to token JSON in GitHub. After <a href="/help/onboarding/repo">initial setup</a>:
			</p>
			<ol>
				<li>Make a change to one or more variables in Figma: say, making Color/Red darker</li>
				<li>Click the "Create a pull request" button in Ficus</li>
				<li>
					Ficus opens a pull request on GitHub of the exact changes made to your variables: in this case, changing{" "}
					<code>Color.Red</code> from <code>#ff0000</code> to <code>#990000</code>.
				</li>
			</ol>
			<p>
				With Ficus, designers can make changes that would have previously required manual handoff to an engineer, and those changes
				integrate with the same systems for reviews and versioning and so on that engineers are already using.
			</p>
			<h2>
				What Ficus <em>isn't</em>
			</h2>
			<p>
				Ficus saves tokens in the{" "}
				<a href="https://tr.designtokens.org/" target="_blank">
					W3C Design Token Community Group draft format
				</a>
				. It doesn't support other token file formats, does not work with other design tools, and does not work with tokens stored
				outside of GitHub. It does not transform token JSON into code (say, CSS variables).
			</p>
			<h2>How do I set it up?</h2>
			<ul>
				<li>
					<a href="/help/onboarding/repo">Preparing your GitHub repo to work with Ficus</a> (mostly for engineers)
				</li>
				<li>
					<a href="/help/onboarding/usage">Setting up Ficus and making your first pull request</a> (mostly for designers)
				</li>
			</ul>
			<h2>Legal info</h2>
			<p>
				Ficus is © 2023 Microsoft and developed by Travis Spomer from{" "}
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
					Ficus source on GitHub
				</a>
				.
			</p>
		</Content>
	)
}

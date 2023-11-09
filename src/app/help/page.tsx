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
			<p>Ficus connects your variables in Figma to token JSON in GitHub. After initial setup:</p>
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
			<h2>How does it know what to change?</h2>
			<p>
				Ficus is configured with a file stored on GitHub that links your Figma files to your JSON files. That file tells it, for
				example, that your Figma file called "Design language" has a variable collection called "Global" that corresponds with a
				JSON file called <code>global.json</code>. For each variable in that collection, you can either explicitly tell it the name
				of your JSON token (<code>Color.Red</code>) in the Web Code Syntax field of the variable, or Ficus will just use the name of
				the variable if that's not set.
			</p>
			<h2>How do I avoid breaking it?</h2>
			<p>Ficus is pretty flexible but it does require a few things to remain constant.</p>
			<ul>
				<li>The names of the variable collections—if these change, they need to be changed in the manifest file on GitHub too.</li>
				<li>
					The names and organization of the variables themselves <em>if</em> you don't explicitly set the Web Code Syntax field—if
					the variable name/syntax changes, it will be reflected in the token files, which will probably look like one token was
					deleted and one was added. Changing the names of tokens can break code that depends on the existing names.
				</li>
			</ul>
			<h2>How do I review changes?</h2>
			<p>
				The actual token review will take place on GitHub. From there you can also close the pull request if you made it by
				accident, add comments, tag people for review, and more.
			</p>
			<p>
				At this time it's not possible to update an existing code review from this tool—close the first one on GitHub, and then make
				a new one with Ficus.
			</p>
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
				.
			</p>
		</Content>
	)
}

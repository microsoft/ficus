"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { OutlineButton } from "@/components/Button"
import { Content } from "@/components/ContentStack"

export default function Help() {
	const router = useRouter()

	return (
		<Content>
			<h1>What the heck is Ficus</h1>
			<div>
				<OutlineButton
					onClick={() => {
						router.push("/")
					}}
				>
					Back
				</OutlineButton>
			</div>
			<h2>It's a prototype</h2>
			<p>
				I've prioritized making sure that the actual functionality works—this obviously is not the ideal user experience. Sorry for
				the mess. I regret that you are seeing it in this state before it has a real UI and stuff.
			</p>
			<h2>It connects variables in Figma to tokens in GitHub</h2>
			<p>Ficus makes it possible to edit token JSON in a centralized GitHub repo in Figma:</p>
			<ol>
				<li>In Figma, change a variable called "Color / Red", say, by making it darker.</li>
				<li>Click the "Create a pull request" button in Ficus.</li>
				<li>
					Ficus opens a pull request that changes <code>Color.Red</code> from <code>#ff0000</code> to <code>#990000</code>.
				</li>
			</ol>
			<p>
				Now you can make changes that would have previously required manual handoff to an engineer, and those changes integrate with
				the same systems for reviews and versioning and so on that engineers are already using. That's the whole workflow!
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
			<h2>Who made this thing?</h2>
			<p>Travis Spomer made it and it's © 2023 Microsoft.</p>
		</Content>
	)
}

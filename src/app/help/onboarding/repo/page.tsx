"use client"

import React from "react"
import styles from "./page.module.css"
import { Content } from "@/components/ContentStack"

export default function OnboardingRepo() {
	return (
		<Content>
			<h1>Preparing your GitHub repo to work with Ficus</h1>
			<h2>What you need</h2>
			<p>Let's make sure you have everything you need:</p>
			<ul>
				<li>A repo on GitHub.com</li>
				<li>
					Optionally, some token JSON files in that repo in the{" "}
					<a href="https://tr.designtokens.org/" target="_blank">
						W3C Design Token Community Group draft format
					</a>{" "}
					(or, Ficus can just create them from scratch)
				</li>
				<li>Links to the Figma files that contain the variables you want to use</li>
				<li>An understanding of how your Figma variables relate to your tokens</li>
			</ul>
			<h2>How this will work</h2>
			<p>
				You'll need to add a file to your repo that tells Ficus how to interact with it. I recommend naming it{" "}
				<code>ficus.json</code> but anything will work. All of the token JSON files that you want Ficus to update should be in the
				same folder or subfolders. This Ficus config file links a variable collection in Figma with one or more token JSON files.
			</p>
			<p>Keep in mind that this is an internal tool and not supported or warranted in any way.</p>
			<h2>Setting up ficus.json</h2>
			<p>
				Create a new <code>ficus.json</code> file in your repo either through the GitHub UI or your favorite text editor. You can
				start with this text:
			</p>
			<pre className={styles.tabbed}>
				<code>
					{`{
	"name": "My design system",
	"figma": {
		"files": [
			{
				"key": "https://www.figma.com/file/abcdefg1234567890/My-variables-file",
				"collections": {
					"Global tokens": {
						"modes": {
							"Value": [ "global.json" ]
						}
					}
				}
			}
		]
	}
}`}
				</code>
			</pre>
			<p>
				The above example assumes that you have a single Figma file called "My variables file" that has a single variable collection
				called "Global tokens" with a single mode called "Value". The tokens in the Value collection should be saved to{" "}
				<code>global.json</code>. Of course, you'll need to adjust it to match how your tokens are organized. Here's what you can
				change:
			</p>
			<ul>
				<li>
					<strong>name:</strong> This just helps you keep multiple Ficus configurations separate. It can be whatever you want.
				</li>
				<li>
					<strong>figma.files</strong> This is an array so you can include multiple Figma files at once: for example, you might
					have your global variables in one file and your alias variables in another.
					<ul>
						<li>
							<strong>key:</strong> This is either a link to a Figma file, or just the file's "key" (the path segment after{" "}
							<code>file</code> in the URL).
						</li>
						<li>
							<strong>collections:</strong> A list of the variable collections that you want Ficus to use. Each key in the
							object should exactly match the name of a variable collection in this Figma file, "Global tokens" in this
							example.
							<ul>
								<li>
									<strong>modes:</strong> A list of the modes in this variable collection. Each key in the object should
									exactly match the name of a mode in the variable collection, "Value" in this example. The value of each
									mode is an array of one string for each file connected to that mode. (Normally you would have a single
									token file for each mode, but you can split your tokens across multiple files and Ficus will try its
									best to add tokens to a reasonable place.)
								</li>
							</ul>
						</li>
					</ul>
				</li>
			</ul>
			<p>
				Once you've created your Ficus config file, make sure that you commit and push. You'll need the GitHub URL of that file to
				use Ficus. It will look something like this:
			</p>
			<p>
				<code>https://github.com/TravisSpomer/MyTokens/blob/main/src/ficus.json</code>
			</p>
			<h2>What's next</h2>
			<p>
				Ficus is now set up! The next thing you should do is perform a test run before inviting designers to make their first pull
				requests.
			</p>
			<ul>
				<li>Optionally, create a new fork or branch of your repo that you can use for your testing.</li>
				<li>Make sure you get the correct URL for ficus.json in that fork or branch.</li>
				<li>
					Read through the steps to{" "}
					<strong>
						<a href="/help/onboarding/usage">Setting up Ficus and making your first pull request</a>
					</strong>
					.
				</li>
				<li>
					Once you've verified that things are working properly, share the GitHub URL of your ficus.json file with your designer.
					Now they can make their first pull request with Ficus!
				</li>
			</ul>
			<h2>How do I turn these design tokens into CSS?</h2>
			<p>
				Ficus doesn't do anything like that, but there are lots of tools that can. Or, you can write your own: the design token
				format is pretty simple.
			</p>
			<h2>What if my token names don't match between Figma and code?</h2>
			<p>
				By default, a token named "Color/Red" in Figma will be saved in JSON as <code>Color.Red</code>. If that's not right, find
				the variable in Figma and click Edit variable, and then scroll down to Code Syntax. Click the plus sign (+) and then Web,
				and then type the name of the token there. Do that for every token that's named differently.
			</p>
			<h2>Security</h2>
			<p>
				Ficus has no special access to your repo: only people who already have access to your repo will be able to use Ficus to open
				pull requests.
			</p>
		</Content>
	)
}

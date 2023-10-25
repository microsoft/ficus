"use client"

import React from "react"
import styles from "./page.module.css"
import { AccentButton } from "@/components/Button"
import { Content } from "@/components/ContentStack"
import { getManifestPath, isProperlyConfigured } from "@/utils/config"
import { getFigmaFileFriendlyName, getFigmaFilePublishedVariables, getFigmaFileVariables } from "@/utils/figma"
import { GitHubUploadFile, createBranch, createPullRequest, getFileJSON, parseGitHubBlobUrl, uploadFiles } from "@/utils/github"
import { figmaColorToTokenJsonColor } from "@/utils/figma"
import type {
	FileVariablesLocalResponseVariableValueAlias,
	FileVariablesLocalResponseVariable,
	FileVariablesLocalResponseVariableCollection,
	FileVariablesPublishedResponseVariable,
	FloatVariableScope,
} from "@/types/figma"
import { ValueType } from "@/types/figma"
import type { JsonFigmaFile, JsonManifest } from "@/types/manifest"
import { getFriendlyTokenJSON, replaceAllTokensWithPlaceholders, type JsonToken, type JsonTokenDocument } from "@/utils/tokenjson"

export default function Home() {
	const [isReady, setIsReady] = React.useState<boolean | null>(null)
	const [isBusy, setIsBusy] = React.useState(false)
	const [status, setStatus] = React.useState<string[]>([])
	const [pullRequestUrl, setPullRequestUrl] = React.useState<string | null>(null)

	React.useEffect(() => {
		// Only access config settings from effects, since localStorage doesn't exist on the server
		setIsReady(isProperlyConfigured())
	}, [])

	return (
		<Content>
			<h1>
				You change variables
				<br />
				&amp; Ficus changes code.
			</h1>
			{isReady === true && (
				<div className={styles.horizontal}>
					<AccentButton onClick={createFigmaPullRequest} disabled={isBusy}>
						Create a PR of my changes
					</AccentButton>
				</div>
			)}
			{isReady === false && (
				<>
					<h2>It'll just take a few minutes to get started.</h2>
					<p>You only have to do this once. Start with that Settings link above!</p>
				</>
			)}
			<ul className={styles.status}>
				{status.map((line, index) => (
					<li key={index}>{line}</li>
				))}
			</ul>
			{pullRequestUrl && (
				<p>
					<strong>
						<a href={pullRequestUrl} target="_blank">
							See the pull request on GitHub
						</a>
					</strong>
				</p>
			)}
		</Content>
	)

	// TODO: Split this code into multiple phases and get it out of the UI

	async function createFigmaPullRequest() {
		const gitHub = parseGitHubBlobUrl(getManifestPath()!)
		if (!gitHub) return

		setIsBusy(true)
		let canContinue = true
		let newStatus: string[] = []
		setStatus(newStatus)

		// First, download the manifest file from GitHub.

		let manifest: JsonManifest
		try {
			manifest = await getFileJSON(gitHub.repo, gitHub.branch, gitHub.path)
			newStatus = [...newStatus, `GitHub repo: ${gitHub.repo} (${gitHub.branch} branch), loaded ${gitHub.path}`]
			setStatus(newStatus)
		} catch (ex) {
			newStatus = [...newStatus, `❌ Failed to find manifest file: ${getManifestPath()}`]
			canContinue = false
			setStatus(newStatus)
			return
		}

		// Strip the path of the manifest file off: we don't need it anymore now.
		{
			const slashIndex = gitHub.path.indexOf("/")
			if (slashIndex >= 0) gitHub.path = gitHub.path.substring(0, slashIndex)
			else gitHub.path = ""
		}

		// Now we're ready to get started!

		const output: FigmaFileData[] = []

		for (const figmaFile of manifest.figma.files) {
			const fileKey = figmaFile.key

			const [friendlyName, figmaVariablesData, figmaPublishedVariablesDataById] = await Promise.all([
				getFigmaFileFriendlyName(fileKey),
				getFigmaFileVariables(fileKey),
				getFigmaFilePublishedVariables(fileKey),
			])
			newStatus = [...newStatus, `Figma document: ${friendlyName}`]
			setStatus(newStatus)

			// The published variables data is returned keyed by id, but we'll look it up by subscribed_id, so re-index it now.
			const figmaPublishedVariablesDataBySubscribedId: FigmaFileData["remoteVariables"] = {}
			for (const variableId in figmaPublishedVariablesDataById.variables) {
				const variable = figmaPublishedVariablesDataById.variables[variableId]
				figmaPublishedVariablesDataBySubscribedId[variable.subscribed_id] = variable
			}

			const thisOutputFile: FigmaFileData = {
				manifest: figmaFile,
				localVariables: figmaVariablesData.variables,
				localVariableCollections: figmaVariablesData.variableCollections,
				remoteVariables: figmaPublishedVariablesDataBySubscribedId,
				collections: {},
			}
			output.push(thisOutputFile)

			const localVariablesOnly = Object.values(figmaVariablesData.variables).filter(thisVariable => !thisVariable.remote)
			newStatus = [
				...newStatus,
				`${localVariablesOnly.length} local variables (plus ${
					Object.keys(figmaVariablesData.variables).length - localVariablesOnly.length
				} imported)`,
			]
			setStatus(newStatus)

			const localVariableCollectionsOnly = Object.values(figmaVariablesData.variableCollections).filter(
				thisCollection => !thisCollection.remote
			)
			for (const collectionName in figmaFile.collections) {
				const variableCollection = localVariableCollectionsOnly.find(thisCollection => thisCollection.name === collectionName)
				if (variableCollection) {
					newStatus = [...newStatus, `✔️ Variable collection: ${collectionName}`]
					setStatus(newStatus)

					const thisOutputCollection: OutputTokenCollection = { modes: {} }
					thisOutputFile.collections[variableCollection.id] = thisOutputCollection

					for (const modeName in figmaFile.collections[collectionName].modes) {
						const mode = variableCollection.modes.find(thisMode => thisMode.name === modeName)
						if (mode) {
							newStatus = [...newStatus, `⋮ ✔️ Mode: ${modeName} → ${figmaFile.collections[collectionName].modes[modeName]}`]
							setStatus(newStatus)

							thisOutputCollection.modes[mode.modeId] = []
							for (const filename of figmaFile.collections[collectionName].modes[modeName]) {
								let fileContents: JsonTokenDocument | undefined
								try {
									fileContents = await getFileJSON(gitHub.repo, gitHub.branch, `${gitHub.path}/${filename}`)
									newStatus = [...newStatus, `⋮ ⋮ ✔️ ${filename} found on GitHub`]
								} catch (ex) {
									// TODO: Handle this differently if the file is not found versus if there was any other error (say, JSON parsing)
									newStatus = [...newStatus, `⋮ ⋮ ⚠ ${filename} will be created from scratch`]
								}
								thisOutputCollection.modes[mode.modeId].push({
									filename: filename,
									exists: !!fileContents,
									previousTokens: fileContents,
									tokens: fileContents ? replaceAllTokensWithPlaceholders(fileContents) : {},
								})
							}
						} else {
							newStatus = [...newStatus, `⋮ ❌ Variable collection is missing mode ${modeName}!`]
							setStatus(newStatus)
							canContinue = false
						}
					}
				} else {
					newStatus = [...newStatus, `❌ File is missing variable collection ${collectionName}!`]
					setStatus(newStatus)
					canContinue = false
				}
			}
		}

		if (!canContinue) {
			newStatus = [...newStatus, "❌ ...cannot continue because of errors."]
			setStatus(newStatus)
			return
		}

		for (const thisOutput of output) {
			const variablesInThisFile = thisOutput.localVariables
			const variableCollectionsInThisFile = thisOutput.localVariableCollections
			for (const thisVariableId in variablesInThisFile) {
				const thisVariable = variablesInThisFile[thisVariableId]
				if (thisVariable.remote) continue
				const thisVariableCollection = variableCollectionsInThisFile[thisVariable.variableCollectionId]
				if (!thisVariableCollection) {
					newStatus = [...newStatus, `⋮ ⚠ Variable ${thisVariable.name} was from an unknown variable collection`]
					setStatus(newStatus)
					continue
				}

				const tokenPath = getNameArrayFromVariable(thisVariable)

				const outputCollection = thisOutput.collections[thisVariableCollection.id]
				if (!outputCollection) {
					newStatus = [
						...newStatus,
						`⋮ ℹ Variable ${thisVariable.name} is from an unknown variable collection we're not including in the output`,
					]
					setStatus(newStatus)
					continue
				}

				const thisVariableCollectionModeIdToName: { [modeId: string]: string } = {}
				for (const entry of thisVariableCollection.modes) thisVariableCollectionModeIdToName[entry.modeId] = entry.name

				const valuesByMode = thisVariable.valuesByMode
				for (const modeId in valuesByMode) {
					const modeName = thisVariableCollectionModeIdToName[modeId]
					if (!modeName) {
						newStatus = [...newStatus, `⋮ ⚠ Variable ${thisVariable.name} has an extra mode defined`]
						setStatus(newStatus)
						continue
					}
					const value = valuesByMode[modeId]
					const files = outputCollection.modes[modeId]
					if (!files) continue
					setValueInOutput(files, tokenPath, thisVariable, value, output)
				}
			}
		}

		newStatus = [...newStatus, "Now I'm ready to upload to GitHub."]
		setStatus(newStatus)

		const filesToUpload: GitHubUploadFile[] = []
		for (const figmaFile of output) {
			for (const collectionName in figmaFile.collections) {
				const collection = figmaFile.collections[collectionName]
				for (const modeName in collection.modes) {
					const outputFiles = collection.modes[modeName]
					for (const outputFile of outputFiles) {
						filesToUpload.push({
							path: `${gitHub.path}/${outputFile.filename}`,
							contents: getFriendlyTokenJSON(outputFile.tokens, /* sort: */ !outputFile.exists),
						})
					}
				}
			}
		}
		const branchName = `figma-${Math.floor(Math.random() * 0xffffffff).toString(16)}`
		const commitMessage = "Changes from Figma"
		const prTitle = `Changes from Figma ${new Date().toDateString()}`
		const prBody = ""
		const createBranchSha = await createBranch(gitHub.repo, gitHub.branch, branchName)
		await uploadFiles(gitHub.repo, branchName, filesToUpload, createBranchSha, commitMessage)
		const newPullRequestUrl = await createPullRequest(gitHub.repo, branchName, gitHub.branch, prTitle, prBody)

		newStatus = [...newStatus, `⋮ ✔️ Pull request created`]
		setStatus(newStatus)

		newStatus = [...newStatus, "✔️ ...done!"]
		setStatus(newStatus)
		setPullRequestUrl(newPullRequestUrl)
	}
}

/** Gets the JSON name of a variable as an array of token path segments (["Global", "Color", "Red"]). */
function getNameArrayFromVariable(variable: FileVariablesLocalResponseVariable): string[] {
	if (variable.codeSyntax && variable.codeSyntax.WEB) {
		// "Global.Color.Red"
		return variable.codeSyntax.WEB.split(".")
	} else {
		// "Global/Color/Red"
		return variable.name.split("/")
	}
}

function getAliasSyntaxForVariable(variable: FileVariablesLocalResponseVariable): string {
	return `{${getNameArrayFromVariable(variable).join(".")}}`
}

function setValueInOutput(
	files: OutputTokenFile[],
	tokenPath: string[],
	variable: FileVariablesLocalResponseVariable,
	value: any,
	data: readonly Readonly<FigmaFileData>[]
) {
	if (files.length === 0) return

	let outputFile: OutputTokenFile | undefined
	let outputFilePathSegmentsMatching: number = 0
	let inputToken: JsonToken | undefined

	// This token may have been defined in any of the files, so find the LAST one that defines it (since those have precedence).
	// If the token isn't defined yet, we use the last one that had tokens most similar to this one, if possible.
	for (let i = files.length - 1; i >= 0; i--) {
		const file = files[i]

		if (!file.exists) continue
		let parent = file.previousTokens!
		for (let matching = 0; matching < tokenPath.length; matching++) {
			const child = parent[tokenPath[matching]]
			if (!child) {
				// Token isn't here.
				// "matching" is how many segments were matched until failing.
				if (matching > outputFilePathSegmentsMatching) {
					// This file doesn't contain the token we're looking for, but it's the closest match we have so far.
					outputFile = file
					outputFilePathSegmentsMatching = matching
				}
				break
			} else if ("$value" in child) {
				if (matching === tokenPath.length - 1) {
					// We found the token we're looking for!
					outputFile = file
					inputToken = child as JsonToken
				}
				break
			}
			// Otherwise, keep iterating through path segments.
			parent = child
		}
		// If we found a token, we can stop iterating through files.
		if (inputToken) break
	}

	// If we didn't find an existing token with that path anywhere, create one in the best location we can come up with.
	// Otherwise, create the new one in the exact same location as in the original file.

	// If we didn't even get close, just choose the first file.
	if (!outputFile) outputFile = files[0]

	// Create that token path. This looks pretty similar to the code above, but the first pass is read-only, and now we're creating
	// hierarchy as we navigate through the document.
	let parent: any = outputFile.tokens
	for (let i = 0; i < tokenPath.length; i++) {
		const name = tokenPath[i]
		const child: any = parent[name]
		if (child && typeof child !== "symbol") {
			parent = child
		} else {
			const newGroup = {}
			parent[name] = newGroup
			parent = newGroup
		}
	}
	if (!parent) throw new Error()
	const outputToken: JsonToken = parent

	// Now, we have the token that we're looking for, even if we had to create it ourselves. Update it.
	let aliasValue: string | undefined
	if (typeof value === "object" && value.type === ValueType.Alias) {
		const target = findAliasTarget((value as FileVariablesLocalResponseVariableValueAlias).id, data)
		if (!target) aliasValue = `{UNRESOLVED ALIAS:  ${value.id}}`
		else if ("codeSyntax" in target) aliasValue = getAliasSyntaxForVariable(target)
		else aliasValue = `{UNRESOLVED REMOTE ALIAS: ${target.name}}`
		// TODO: Surface these errors in a better way than just text in a code review
	}

	switch (variable.resolvedType) {
		case "BOOLEAN":
			outputToken.$type = "boolean"
			outputToken.$value = aliasValue || value
			break
		case "STRING":
			// If the input token is already a more specific format, like fontFamily, keep that.
			outputToken.$type = !inputToken || !inputToken.$type ? "string" : inputToken.$type
			outputToken.$value = aliasValue || value
			break
		case "FLOAT":
			// If this input token already exists, we'll keep the same type. Otherwise, guess from the scopes.
			if (!inputToken || !inputToken.$type) {
				const scopes = variable.scopes as readonly FloatVariableScope[]
				if (scopes) {
					if (scopes.includes("ALL_SCOPES")) outputToken.$type = "number"
					else if (scopes.includes("WIDTH_HEIGHT") || scopes.includes("GAP") || scopes.includes("CORNER_RADIUS"))
						outputToken.$type = "dimension"
					else outputToken.$type = "number"
				}
			} else outputToken.$type = inputToken.$type
			switch (outputToken.$type) {
				case "dimension":
					outputToken.$value = aliasValue || `${value}px`
					break
				case "duration":
					outputToken.$value = aliasValue || `${value}ms`
					break
				case "fontWeight":
					outputToken.$value = aliasValue || value
					break
				case undefined:
				default:
					outputToken.$type = "number"
					outputToken.$value = aliasValue || value
			}
			break
		case "COLOR":
			outputToken.$type = "color"
			outputToken.$value = aliasValue || figmaColorToTokenJsonColor(value)
			break
		default:
			throw new Error(`Token ${tokenPath.join(".")} has an unknown variable type ${variable.resolvedType}.`)
	}

	if (variable.description) {
		// Ignore descriptions that are just a repeat of the value
		outputToken.$description =
			variable.description.toUpperCase() === String(outputToken.$value).toUpperCase() ? undefined : variable.description
	} else if (inputToken) {
		outputToken.$description = inputToken.$description
	}
	outputToken.$extensions = inputToken && inputToken.$extensions
}

function findAliasTarget(
	targetVariableId: string,
	data: readonly Readonly<FigmaFileData>[]
): FileVariablesLocalResponseVariable | FileVariablesPublishedResponseVariable | null {
	for (const file of data) {
		const localVariable = file.localVariables[targetVariableId]
		if (localVariable) return localVariable
		const publishedVariable = file.remoteVariables[targetVariableId]
		if (publishedVariable) {
			// We found the variable, but it's remote! There should be a corresponding local version, so return that.
			return findAliasTarget(publishedVariable.id, data) || publishedVariable
		}
	}

	return null
}

interface FigmaFileData {
	readonly manifest: JsonFigmaFile
	readonly localVariables: { [variableId: string]: FileVariablesLocalResponseVariable }
	readonly localVariableCollections: { [variableCollectionId: string]: FileVariablesLocalResponseVariableCollection }
	readonly remoteVariables: { [subscribedId: string]: FileVariablesPublishedResponseVariable }
	readonly collections: { [variableCollectionId: string]: OutputTokenCollection }
}

interface OutputTokenCollection {
	readonly modes: { [modeId: string]: OutputTokenFile[] }
}

interface OutputTokenFile {
	filename: string
	exists: boolean
	previousTokens?: JsonTokenDocument
	tokens: JsonTokenDocument
}

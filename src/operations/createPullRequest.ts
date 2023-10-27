import React from "react"
import type { CreatePullRequestStatus } from "@/types/operation"

type FigmaFileData = symbol // *** JUST FOR DEVELOPING THE TYPES; MERGE WITH PAGE.TSX

type CreatePullRequestState = FigmaFileData[]

interface CreatePullRequestMethods {
	TESTONLY_BEGIN(): void
}

class CreatePullRequestOperation implements CreatePullRequestMethods {
	#status: CreatePullRequestStatus
	#data: CreatePullRequestState
	#listeners: (() => void)[] = []

	constructor() {
		this.#status = initialStatus
		this.#data = []

		this.subscribe = this.subscribe.bind(this)
		this.getSnapshot = this.getSnapshot.bind(this)
	}

	subscribe(listener: () => void) {
		this.#listeners.push(listener)
		return () => {
			const index = this.#listeners.findIndex(thisListener => thisListener === listener)
			if (index >= 0) this.#listeners.splice(index, 1)
		}
	}

	getSnapshot() {
		return this.#status
	}

	#onUpdate() {
		for (const listener of this.#listeners) {
			listener()
		}
	}

	TESTONLY_BEGIN() {
		this.#status = { ...this.#status, progress: "busy" }
		this.#onUpdate()
	}
}

const initialStatus: CreatePullRequestStatus = {
	title: "",
	progress: "none",
	steps: [],
}

function getServerSnapshot(): CreatePullRequestStatus {
	return initialStatus
}

let instance: CreatePullRequestOperation | undefined

export function useCreatePullRequest(): [CreatePullRequestStatus, CreatePullRequestMethods] {
	if (!instance) {
		instance = new CreatePullRequestOperation()
	}
	return [React.useSyncExternalStore(instance.subscribe, instance.getSnapshot, getServerSnapshot), instance]
}

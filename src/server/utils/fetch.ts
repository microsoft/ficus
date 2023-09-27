/** Given a "base" RequestInit of default options, and a second RequestInit, returns a new RequestInit that combines the options from the two with the second RequestInit taking precedence over the first. */
export function mergeRequestInit(base: Readonly<RequestInit>, request?: RequestInit): RequestInit {
	if (!request) return base

	let combinedHeaders: HeadersInit | undefined
	if (base.headers || request.headers) {
		const baseHeaders = Array.isArray(base.headers)
			? Object.fromEntries(base.headers)
			: typeof base.headers === "object"
			? base.headers
			: undefined
		const requestHeaders = Array.isArray(request.headers)
			? Object.fromEntries(request.headers)
			: typeof request.headers === "object"
			? request.headers
			: undefined
		combinedHeaders = {
			...baseHeaders,
			...requestHeaders,
		}
	}

	return {
		...base,
		...request,
		headers: combinedHeaders,
	}
}

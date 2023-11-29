"use client"

// Export things that we need from Fluent UI React here below "use client" because Fluent UI React doesn't support Next.js.
// This appears to only be necessary for things used directly by layout.tsx.

export { FluentProvider, webLightTheme } from "@fluentui/react-components"

import type { BrandVariants, Theme } from "@fluentui/react-components"
import { createLightTheme } from "@fluentui/react-components"

const ficusColors: BrandVariants = {
	10: "#040205",
	20: "#1E1321",
	30: "#321D38",
	40: "#43254B",
	50: "#532E5E",
	60: "#643871",
	70: "#744384",
	80: "#844E96",
	90: "#945BA7",
	100: "#A369B7",
	110: "#B177C5",
	120: "#BD87D1",
	130: "#C998DB",
	140: "#D5AAE4",
	150: "#DFBBEC",
	160: "#E9CEF3",
}

export const ficusTheme: Theme = {
	...createLightTheme(ficusColors),
}

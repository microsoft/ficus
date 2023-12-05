import React from "react"
import Link from "next/link"
import type { ButtonProps } from "@fluentui/react-components"
import { Button } from "@fluentui/react-components"

export type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
	Required<Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">> &
	ButtonProps

// The Fluent UI React Button control supports as="a", but then it picks up global link styling rules which take precedence over the component's
// own styling rules due to CSS specificity. This component adds a "linkbutton" class to work around this and integrates Next.js's Link for perf.

export function LinkButton(props: LinkButtonProps) {
	return (
		<Link href={props.href} legacyBehavior>
			<Button as="a" className={props.className ? `${props.className} linkbutton` : "linkbutton"} {...props} />
		</Link>
	)
}

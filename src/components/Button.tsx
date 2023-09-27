import type React from "react"
import styles from "./Button.module.css"

export function OutlineButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button type="button" className={props.className ? `${styles.outline} ${props.className}` : styles.outline} {...props}>
			<div className={styles.contents}>{props.children}</div>
		</button>
	)
}

export function AccentButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button type="button" className={props.className ? `${styles.accent} ${props.className}` : styles.accent} {...props}>
			<div className={styles.contents}>{props.children}</div>
		</button>
	)
}
export default AccentButton

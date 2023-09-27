import type React from "react"
import styles from "./Textbox.module.css"

export function Textbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input type={props.type || "text"} className={props.className ? `${styles.textbox} ${props.className}` : styles.textbox} {...props}>
			{props.children}
		</input>
	)
}
export default Textbox

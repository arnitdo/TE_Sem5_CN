import { useEffect, useState } from "react"

const LEAK_RATE = 1 / 1000

export default function LeakyBucket() {
	const [charQueue, setCharQueue] = useState<string[]>([])
	const [outputQueue, setOutputQueue] = useState<string[]>([])

	const appendChar = (char: string) => {
		setCharQueue((prevChars) => {
			return [...prevChars, char]
		})
	}

	useEffect(() => {
		function keyHandler(event: KeyboardEvent) {
			appendChar(event.key)
		}

		window.addEventListener("keydown", keyHandler)

		return () => {
			window.removeEventListener("keydown", keyHandler)
		}
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			setCharQueue((prevChars) => {
				const [char, ...rest] = prevChars
				setOutputQueue((prevOutput) => {
					return [...prevOutput, char]
				})
				return rest
			})
		}, 1 / LEAK_RATE)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div
			className={
				"w-screen h-screen flex flex-col items-center justify-center p-4 gap-4"
			}
		>
			<div className={"flex flex-col items-center gap-2"}>
				<div className={"flex gap-2"}>
					<span>{"Input: "}</span>
					<span>{charQueue.join("")}</span>
				</div>
				<div className={"flex gap-2"}>
					<span>{"Output: "}</span>
					<span>{outputQueue.join("")}</span>
				</div>
				<button
					onClick={() => {
						setCharQueue([])
						setOutputQueue([])
					}}
					className={"p-2 px-4 border border-black rounded"}
				>
					Clear
				</button>
			</div>
		</div>
	)
}

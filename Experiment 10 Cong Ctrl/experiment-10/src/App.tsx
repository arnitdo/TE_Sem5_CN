import LeakyBucket from "./LeakyBucket"
import TokenBucket from "./TokenBucket"

export default function App() {
	return (
		<div
			className={
				"font-mono w-screen min-h-screen flex flex-row items-center"
			}
		>
			<LeakyBucket />
			<TokenBucket />
		</div>
	)
}

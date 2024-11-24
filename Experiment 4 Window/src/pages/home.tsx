import { Link } from "react-router-dom";

export function Homepage() {
	return (
		<div
			className={
				"w-screen min-h-screen flex flex-col items-center justify-center"
			}
		>
			<Link
				to={"/go-back-n"}
				className={"border p-4 rounded text-center"}
			>
				Go-Back-N Implementation
			</Link>
		</div>
	);
}

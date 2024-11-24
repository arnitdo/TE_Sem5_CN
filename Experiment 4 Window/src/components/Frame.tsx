import { type Frame } from "../lib";

type FrameProps = Frame & {
	onClick?: (frameData: Frame) => any;
	inWindow?: (frameData: Frame) => boolean;
};

export function Frame(props: FrameProps) {
	return (
		<div
			className={`flex flex-col p-2 border rounded text-center min-w-48 ${
				props.ackReceived ? "border-green-400" : "border-red-400"
			} ${props.inWindow?.(props) ? "bg-gray-200" : ""} ${
				props.onClick ? "cursor-pointer" : ""
			}`}
			onClick={() => {
				if (props.onClick) {
					props.onClick(props);
				}
			}}
		>
			Seq No {props.sequenceNumber} [RT = {props.reTransmit ?? "X"}]
		</div>
	);
}

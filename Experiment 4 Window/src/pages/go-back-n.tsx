import { useEffect, useState } from "react";
import { Frame } from "../components/Frame";
import { FrameType, type Frame as FrameT } from "../lib";

// const TICK_RATE = 2000;

export function GoBackN() {
	const [windowSize, setWindowSize] = useState<number>(1);
	const [transmitterFrames, setTransmitterFrames] = useState<FrameT[]>([]);
	const [receiverFrames, setReceiverFrames] = useState<FrameT[]>([]);
	const [[windowStart, windowEnd], setWindow] = useState<[number, number]>([
		0, 0,
	]);

	const [logContent, setLogContent] = useState<string[]>([]);

	const resetSim = () => {
		setWindowSize(1);
		setWindow([0, 1]);
		setTransmitterFrames([]);
		setReceiverFrames([]);
		setLogContent(["Reset!"]);
	};

	const addTransmitterFrame = () => {
		let frameData = {
			ackReceived: false,
			frameType: FrameType.DAT,
			sequenceNumber: transmitterFrames.length,
		};
		setTransmitterFrames((prevFrames) => {
			return [...prevFrames, frameData];
		});
		setLogContent((prevContent) => {
			return [
				...prevContent,
				`Transmitter transmitted frame with Sequence No ${frameData.sequenceNumber}`,
			];
		});

		return frameData;
	};

	const slideWindowForward = () => {
		setWindow(([prevWindowStart, prevWindowEnd]) => {
			return [prevWindowStart + 1, prevWindowEnd + 1];
		});
	};

	const acknowledgeFrame = (frameNo: FrameT["sequenceNumber"]) => {
		if (frameNo < windowStart || frameNo >= windowEnd) {
			return;
		}
		const allPreviousTransmittedFramesAck = transmitterFrames.every(
			(transmitFrame) => {
				const { sequenceNumber, ackReceived } = transmitFrame;
				if (sequenceNumber < windowStart) {
					return true;
				}
				return ackReceived;
			}
		);
		if (!allPreviousTransmittedFramesAck) {
			// Retransmit all previous frames
			const nonAckFrames = transmitterFrames.filter((transmitFrame) => {
				const { sequenceNumber } = transmitFrame;
				return (
					sequenceNumber < frameNo && sequenceNumber >= windowStart
				);
			});

			setTransmitterFrames((prevFrames) => {
				return [
					...prevFrames,
					...nonAckFrames.map((nonAckFrame, frameIdx) => {
						setLogContent((prevLog) => {
							return [
								...prevLog,
								...nonAckFrames.map(() => {
									return `Retransmit frame ${
										nonAckFrame.sequenceNumber
									} as frame ${prevFrames.length + frameIdx}`;
								}),
							];
						});
						return {
							...nonAckFrame,
							sequenceNumber: prevFrames.length + frameIdx,
							ackReceived: false,
							reTransmit: nonAckFrame.sequenceNumber,
						};
					}),
				];
			});
			setReceiverFrames((prevFrames) => {
				return [
					...prevFrames,
					...nonAckFrames.map((nonAckFrame, frameIdx) => {
						setLogContent((prevLog) => {
							return [
								...prevLog,
								...nonAckFrames.map(() => {
									return `Re-Receive frame ${
										nonAckFrame.sequenceNumber
									} as frame ${prevFrames.length + frameIdx}`;
								}),
							];
						});
						return {
							...nonAckFrame,
							sequenceNumber: prevFrames.length + frameIdx,
							ackReceived: false,
							reTransmit: nonAckFrame.sequenceNumber,
						};
					}),
				];
			});
		}
		setReceiverFrames((prevFrames) => {
			return prevFrames.map((frame) => {
				if (frame.sequenceNumber === frameNo) {
					setLogContent((prevLog) => {
						return [
							...prevLog,
							`Receiver sent acknowledgement for frame ${frameNo}`,
						];
					});
					return { ...frame, ackReceived: true };
				}
				return frame;
			});
		});
		setTransmitterFrames((prevFrames) => {
			return prevFrames.map((frame) => {
				if (frame.sequenceNumber === frameNo) {
					setLogContent((prevLog) => {
						return [
							...prevLog,
							`Transmitter received acknowledgement for frame ${frameNo}`,
						];
					});
					return { ...frame, ackReceived: true };
				}
				return frame;
			});
		});
		slideWindowForward();
	};

	useEffect(() => {
		setWindow(([prevWindowStart]) => {
			return [prevWindowStart, prevWindowStart + windowSize];
		});
	}, [windowSize]);

	// useEffect(() => {
	// 	setInterval(() => {
	// 		const toTransmit = getRandomBoolean();
	// 		if (toTransmit) {
	// 			const transmittedFrame = addTransmitterFrame();
	// 			const toLose = getRandomBoolean();
	// 			if (!toLose) {
	// 				setReceiverFrames((prevFrames) => {
	// 					return [...prevFrames, transmittedFrame];
	// 				});
	// 			}
	// 		}
	// 	}, TICK_RATE);
	// }, []);

	return (
		<div
			className={
				"py-32 w-screen min-h-screen flex flex-col gap-8 items-center justify-center"
			}
		>
			<h1 className={"font-bold text-4xl"}>Go-Back-N Approach</h1>
			<div
				className={
					"p-4 border rounded flex flex-row gap-4 items-center justify-between"
				}
			>
				<p>Select Window Size</p>
				<input
					min={1}
					className={"p-2 border rounded"}
					type={"number"}
					value={windowSize}
					onChange={(e) => {
						setWindowSize(parseInt(e.target.value));
					}}
				/>
				<button
					onClick={resetSim}
					className={"p-2 border rounded bg-red-400"}
				>
					Reset
				</button>
			</div>
			<div
				className={
					"p-4 border rounded flex flex-row gap-4 items-center justify-between"
				}
			>
				<div
					className={"border p-2 rounded bg-gray-200 border-red-400"}
				>
					In Window, No ACK
				</div>
				<div className={"border p-2 rounded border-green-400"}>
					Not In Window, ACK
				</div>
				<div className={"border p-2 rounded border-red-400"}>
					Not In Window, No ACK
				</div>
				<div
					className={
						"border p-2 rounded bg-gray-200 border-green-400"
					}
				>
					In Window, ACK
				</div>
			</div>
			<div className={"flex flex-row gap-4 items-start"}>
				<div
					className={
						"min-w-64 flex flex-col gap-4 p-4 border rounded"
					}
				>
					<h3 className={"text-center font-semibold text-2xl"}>
						Transmitter
					</h3>
					{transmitterFrames.map((transmitterFrame) => {
						return (
							<Frame
								{...transmitterFrame}
								inWindow={(frameData) => {
									return (
										frameData.sequenceNumber >=
											windowStart &&
										frameData.sequenceNumber < windowEnd
									);
								}}
								key={`${transmitterFrame.sequenceNumber}.${
									transmitterFrame.reTransmit ?? 0
								}`}
							/>
						);
					})}
					<button
						className={"p-2 text-center border rounded"}
						onClick={() => {
							const transmittedFrame = addTransmitterFrame();
							setReceiverFrames((prevFrames) => {
								return [...prevFrames, transmittedFrame];
							});
							setLogContent((prevLog) => {
								return [
									...prevLog,
									`Receiver receive frame ${transmittedFrame.sequenceNumber}`,
								];
							});
						}}
					>
						Transmit Frame
					</button>
				</div>
				<div
					className={
						"min-w-64 flex flex-col gap-4 p-4 border rounded"
					}
				>
					<h3 className={"text-center font-semibold text-2xl"}>
						Receiver
					</h3>
					{receiverFrames.map((receivedFrame) => {
						return (
							<Frame
								{...receivedFrame}
								inWindow={(frameData) => {
									return (
										frameData.sequenceNumber >=
											windowStart &&
										frameData.sequenceNumber < windowEnd
									);
								}}
								onClick={(frameData) => {
									acknowledgeFrame(frameData.sequenceNumber);
								}}
								key={`${receivedFrame.sequenceNumber}.${
									receivedFrame.reTransmit ?? 0
								}`}
							/>
						);
					})}
				</div>
			</div>
			<textarea
				value={logContent.join("\n")}
				className={"border p-2 rounded w-[32rem]"}
				rows={logContent.length}
			/>
		</div>
	);
}

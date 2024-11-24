export enum FrameType {
	DAT,
	ACK,
}

export type Frame = {
	sequenceNumber: number;
	frameType: FrameType;
	ackReceived: boolean;
	reTransmit?: number;
};

export function getRandomBoolean(breakPoint = 0.5): boolean {
	return Math.random() > breakPoint;
}

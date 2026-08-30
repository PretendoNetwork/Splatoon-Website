export type Pixel = {
	x: number;
	y: number;
};

export type PixelMap = {
	pixels: Pixel[];
	centerX: number;
	centerY: number;
};

export type FireworkImage = {
	src: string;
	img: any;
} & PixelMap;

export type Rocket = {
	x: number;
	y: number;
	targetX: number;
	targetY: number;
	color: string;
	firework: FireworkImage;
};

export type Burst = {
	x: number;
	y: number;
	expiresAt: number;
};

export type Spark = {
	startX: number;
	startY: number;
	targetX: number;
	targetY: number;
	x: number;
	y: number;
	alpha: number;
	size: number;
	color: string;
	life: number;
	settleFrames: number;
	holdFrames: number;
	spreadFrames: number;
	fadeFrames: number;
};

export type Star = {
	x: number;
	y: number;
	radius: number;
	alpha: number;
	twinkleSpeed: number;
};

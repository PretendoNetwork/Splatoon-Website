// Thank you https://gist.github.com/arenagroove/ffec49d5322245c71d6fc7867066c5eb

// Inverse Gamma Correction for Display-P3
function fromGammaP3(v: number): number {
	return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

type ColorList = [number, number, number];

// Convert Display-P3 to XYZ (D65) - Inverse Matrix
function linearP3ToXyz([r, g, b]: ColorList): ColorList {
	return [
		r * 0.515102 + g * 0.2919656 + b * 0.1571934,
		r * 0.2411823 + g * 0.6922363 + b * 0.0665814,
		r * -0.001049 + g * 0.0418819 + b * 0.7843782
	];
}

// Convert XYZ to Linear sRGB - Inverse Matrix
function xyzToLinearSrgb([x, y, z]: ColorList): ColorList {
	return [
		x * 3.1338561 + y * -1.6168667 + z * -0.4906146,
		x * -0.9787684 + y * 1.9161415 + z * 0.033454,
		x * 0.0719453 + y * -0.2289914 + z * 1.4052427
	];
}

// Standard sRGB Gamma Correction
function toGamma(v: number): number {
	return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

export function displayP3ToRgb(r: number, g: number, b: number): ColorList {
	// Inverse Gamma Correction for Display-P3
	r = fromGammaP3(r);
	g = fromGammaP3(g);
	b = fromGammaP3(b);
	// Convert Linear Display-P3 to XYZ (D65)
	const [x, y, z] = linearP3ToXyz([r, g, b]);

	// Convert XYZ (D65) to Linear sRGB
	let [srgbR, srgbG, srgbB] = xyzToLinearSrgb([x, y, z]);

	// Apply Gamma Correction for sRGB
	srgbR = toGamma(srgbR);
	srgbG = toGamma(srgbG);
	srgbB = toGamma(srgbB);

	// Scale to 0-255 range and round
	return [
		Math.round(srgbR * 255),
		Math.round(srgbG * 255),
		Math.round(srgbB * 255)
	];
}

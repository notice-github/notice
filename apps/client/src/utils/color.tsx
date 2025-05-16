const hexToRGB = (hex: string) => {
	const r = parseInt(hex.slice(1, 3), 16)
	const g = parseInt(hex.slice(3, 5), 16)
	const b = parseInt(hex.slice(5, 7), 16)
	return { r, g, b }
}

const RGBToHex = (r: number, g: number, b: number) => {
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export const calculateLinearGradientColor = (color1: string, color2: string, percentage: number) => {
	if (percentage < 0 || percentage > 100) {
		return color1
	}

	// Convert the percentage to a decimal value
	const decimalPercentage = percentage / 100

	// Convert colors to RGB format
	const color1RGB = hexToRGB(color1)
	const color2RGB = hexToRGB(color2)

	// Calculate the interpolated color values
	const interpolatedR = Math.round(color1RGB.r + (color2RGB.r - color1RGB.r) * decimalPercentage)
	const interpolatedG = Math.round(color1RGB.g + (color2RGB.g - color1RGB.g) * decimalPercentage)
	const interpolatedB = Math.round(color1RGB.b + (color2RGB.b - color1RGB.b) * decimalPercentage)

	// Convert the interpolated RGB values back to hex
	const interpolatedColorHex = RGBToHex(interpolatedR, interpolatedG, interpolatedB)

	return interpolatedColorHex
}

/**
 * Extracts the em value from a string.
 * @param value - The string to extract the em value from.
 * @returns The em value as a number or null if not found.
 */
export function extractEmValue(value: string): number | null {
	const match = value.match(/(\d*\.?\d+)\s*em/)
	return match ? parseFloat(match[1]) : null
}

/**
 * Converts a given value in em to pixels (px).
 * @param emValue - The value in em to be converted to pixels.
 * @returns The converted value in pixels (px) as a string.
 */
export function emToPx(emValue: number): string {
	const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)

	const pxValue = emValue * rootFontSize

	return `${pxValue}px`
}

/**
 * Checks if a given CSS value is in em units.
 * @param value - The CSS value to check.
 * @returns True if the value is in em units, false otherwise.
 */
export function isEmValue(value: string) {
	// Use a regular expression to check if the value ends with "em"
	const emRegex = /\b\d*\.?\d+\s*em\b/
	return emRegex.test(value)
}

/**
 * Checks if a given CSS value is valid for a given CSS property.
 * @param CSSProperty - The CSS property to check.
 * @param value - The CSS value to check.
 * @returns A boolean indicating whether the CSS value is valid for the CSS property.
 */
export function isValidCSSValue(CSSProperty: string, value: string) {
	const cssRule = `${CSSProperty}:${value}`
	return CSS.supports(cssRule)
}

/**
 * Returns the value of a CSS variable from the root element.
 * @param variableName - The name of the CSS variable.
 * @returns The value of the CSS variable or null if it is not defined.
 */
export function getCssVariableValue(variableName: string): string | null {
	const computedStyle = getComputedStyle(document.documentElement)

	const variableValue = computedStyle.getPropertyValue(`--${variableName}`).trim()

	return variableValue || null
}

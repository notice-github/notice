import { colors } from '../../../../../styles/colors'

// /!\ Keep 13 colors,
// this is the only number that ensure that all lowercase letters of the alphabet are covered
// If you need another multiple, you need to find a different way to assign colors
// in an equally distributed way
const tagColors = [
	'#D291BC', // Darker Pastel Pink
	'#66B2A6', // Deeper Mint Green
	'#7C9EB2', // Deeper Baby Blue
	'#B39BC8', // Deeper Lavender
	'#FFAB91', // Richer Peach
	'#F3D250', // Deeper Lemon Chiffon
	'#8DAAD6', // Darker Powder Blue
	'#A890D3', // Deeper Soft Lilac
	'#FF6F61', // Darker Coral
	'#8BC0A6', // Richer Tea Green
	'#9A9CCD', // Darker Periwinkle
	'#E67A94', // Deeper Blush
	'#5CA08E', // Deeper Seafoam Green
]

// Assign a color to a string
// This is used to assign a color to tags
// The color is always the same for a given string
// If there's an error, return spray
export function assignColor(string: string, colorList = tagColors) {
	try {
		if (!string) {
			return colors.yellorange
		}

		const firstLetter = string[0].toLowerCase()

		// Any non-letter, return yellorange
		if (!firstLetter.match(/[a-z]/)) {
			return colors.yellorange
		}

		const alphabet = 'abcdefghijklmnopqrstuvwxyz'
		const colorIndex = alphabet.indexOf(firstLetter) % colorList.length
		return colorList[colorIndex]
	} catch (e) {
		console.error('there was an error assigning color', e)
		// Any error, return spray
		return colors.spray
	}
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const minimalize = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

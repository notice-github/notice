import slug from 'slugify'

export namespace NStrings {
	/**
	 * Capitalizes the first letter of a string.
	 *
	 * @param str - The input string to capitalize.
	 * @returns The capitalized string.
	 */
	export const capitalize = (str: string) => {
		if (str.length === 0) return str
		else if (str.length === 1) return str.toUpperCase()
		else return str.charAt(0).toUpperCase() + str.slice(1)
	}

	/**
	 * Capitalizes the first letter of each word in the provided string.
	 *
	 * @param str - The string to process
	 * @returns A new string where the first letter of each word is capitalized
	 */
	export const capitalizeWords = (str: string) => str.replace(/(^\w{1})|(\s+\w{1})/g, (char) => char.toUpperCase())

	/**
	 * Slugifies a given string.
	 *
	 * @param string - The input string to be slugified.
	 * @param lang - The language code of the locale to use. (default: en)
	 * @returns The slugified string.
	 */
	export const slugify = (str: string, lang = 'en') => {
		return slug(str, {
			replacement: '-', // replace spaces with replacement character, defaults to `-`
			remove: undefined, // remove characters that match regex, defaults to `undefined`
			lower: true, // convert to lower case, defaults to `false`
			strict: true, // strip special characters except replacement, defaults to `false`
			locale: lang, // language code of the locale to use
			trim: true, // trim leading and trailing replacement chars, defaults to `true`
		})
	}
}

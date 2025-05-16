import { NConsts } from './consts'

export namespace NCheckers {
	/**
	 * Checks if the provided input is a valid UUID.
	 *
	 * @param input - The input string to be validated.
	 * @returns `true` if the input is a valid UUID, `false` otherwise.
	 */
	export const isUUID = (input?: string | null) => {
		if (input == null) return false
		return NConsts.UUID_REGEX.test(input)
	}

	/**
	 * Checks if the provided input is a valid URL.
	 *
	 * @param input - The input string to be validated.
	 * @returns `true` if the input is a valid URL, `false` otherwise.
	 */
	export const isURL = (input?: string | null) => {
		if (input == null) return false
		return NConsts.URL_REGEX.test(input)
	}

	/**
	 * Checks if a given input is an ISO formatted date string.
	 *
	 * @param input - The input to check
	 * @returns `true` if the input is an ISO formatted date string, `false` otherwise
	 */
	export const isIsoDateString = (input?: any) => {
		return input && typeof input === 'string' && NConsts.ISO_DATE_REGEX.test(input)
	}
}

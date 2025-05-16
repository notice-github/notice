import UAParser from 'ua-parser-js'

export namespace NParsers {
	/**
	 * Parses a User Agent (UA) string and extracts its components.
	 *
	 * @param input - The User Agent (UA) string to be parsed.
	 * @returns An object containing the parsed components of the User Agent or undefined if the input is not a valid User Agent string.
	 */
	export const parseUA = (input?: string) => {
		if (!input) return undefined

		const ua = UAParser(input)
		const result: {
			raw: string
			bot?: boolean
			browser?: { name: string; version?: string }
			engine?: { name: string; version?: string }
			os?: { name: string; version?: string }
			device?: { type: string; vendor?: string; model?: string }
		} = { raw: ua.ua }

		if (!result.raw || result.raw.trim() === '') return undefined

		if (ua.browser.name) {
			result.browser = { name: ua.browser.name }
			if (ua.browser.version) result.browser.version = ua.browser.version
		}

		if (ua.engine.name) {
			result.engine = { name: ua.engine.name }
			if (ua.engine.version) result.engine.version = ua.engine.version
		}

		if (ua.os.name) {
			result.os = { name: ua.os.name }
			if (ua.os.version) result.os.version = ua.os.version
		}

		if (ua.device.type) {
			result.device = { type: ua.device.type.toLowerCase() }
			if (ua.device.vendor) result.device.vendor = ua.device.vendor
			if (ua.device.model) result.device.model = ua.device.model
		} else {
			result.device = { type: 'desktop' }
		}

		return result
	}

	/**
	 * Parses a URL string and extracts its components.
	 *
	 * @param input - The URL string to be parsed.
	 * @returns An object containing the parsed components of the URL or undefined if the input is not a valid URL.
	 */
	export const parseURL = (input?: string) => {
		if (!input) return undefined

		try {
			const url = new URL(input)
			const hostname = url.hostname
			const parts = hostname.split('.')

			return {
				raw: url.href,
				scheme: url.protocol.replace(':', ''),
				host: hostname,
				domain: parts.slice(-2).join('.'),
				path: url.pathname,
				search: url.search,
			}
		} catch (_) {
			return undefined
		}
	}
}

import { BMSBlockModel, BlockModel } from '@notice-app/models'
import { NStrings } from '@notice-app/tools'

export namespace Utils {
	export const emailToName = (str: string) => {
		const titles = ['mr', 'mrs', 'ms', 'dr', 'prof']
		const suffixes = ['jr', 'jnr', 'sr', 'snr']
		const suffixesUpper = ['ii', 'iii', 'iv']

		let output = ''

		const settings = {
			removeNumbers: true,
			removePlusWords: true,
			titleCase: true,
			caseMc: true,
			caseLetterApostrophe: true,
			uppercaseGenerationalNumbers: true,
			commaPrependGenerationalPhrase: true,
			appendPeriodToTitlePrefix: true,
			lowercaseFamilyParticle: true,
			reverseCommonEmailAddresses: true,
		}

		output = str.split('@')[0]

		// Drop everything after the '+'
		// `john.smith+test` to `john.smith`
		if (settings.removePlusWords) {
			output = output.split('+')[0]
		}

		if (settings.removeNumbers) {
			output = output.replace(/\d/g, '')
		}

		// Replace periods with spaces
		// `john.smith` to `john smith`
		output = output.replace(/\./g, ' ')

		// Replace underscores with spaces
		// `john_smith` to `john smith`
		output = output.replace(/_/g, ' ')

		// Replace duplicate strings from inside
		// `john    smith` to `john smith`
		output = output.replace(/\s\s+/g, ' ')

		// Replace whitespace from both sites of string
		// `  john smith  ` to `john smith`
		output = output.trim()

		// Title case
		// `john smith` to `John Smith`
		if (settings.titleCase) {
			output = output
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')
		}

		// Handle Generational (The Third) names
		// `John Smith Iii` to `John Smith III`
		if (settings.uppercaseGenerationalNumbers) {
			suffixesUpper.forEach(function (suffix) {
				var rx = new RegExp('\\s(' + suffix + ')$', 'gi')
				output = output.replace(rx, function (s) {
					return s.toUpperCase()
				})
			})
		}

		// Handle 'Jr/Sr' names
		// `John Smith Jr` to `John Smith, Jr.`
		if (settings.commaPrependGenerationalPhrase) {
			suffixes.forEach(function (suffix) {
				var rx = new RegExp('\\s(' + suffix + ')$', 'gi')
				output = output.replace(rx, function (s) {
					return ',' + s + '.'
				})
			})
		}

		// Handle title prefixes names
		// `Dr John Smith` to `Dr. John Smith`
		if (settings.appendPeriodToTitlePrefix) {
			titles.forEach(function (prefix) {
				var rx = new RegExp('^(' + prefix + ')\\s', 'gi')
				output = output.replace(rx, function (s) {
					return s.replace(' ', '. ')
				})
			})
		}

		// Handle "son/daughter" of pattern
		if (settings.lowercaseFamilyParticle) {
			output = output
				.replace(/\bAl(?=\s+\w)/g, 'al') // al Arabic or forename Al.
				.replace(/\bAp\b/g, 'ap') // ap Welsh.
				.replace(/\bBen(?=\s+\w)\b/g, 'ben') // ben Hebrew or forename Ben.
				.replace(/\bDell([ae])\b/g, 'dell$1') // della and delle Italian.
				.replace(/\bD([aeiu])\b/g, 'd$1') // da, de, di Italian; du French.
				.replace(/\bDe([lr])\b/g, 'de$1') // del Italian; der Dutch/Flemish.
				.replace(/\bEl\b/g, 'el') // el Greek
				.replace(/\bLa\b/g, 'la') // la French
				.replace(/\bL([eo])\b/g, 'l$1') // lo Italian; le French.
				.replace(/\bVan(?=\s+\w)/g, 'van') // van German or forename Van.
				.replace(/\bVon\b/g, 'von') // von Dutch/Flemish
		}

		// Handle 'Mc' names
		// `Marty Mcfly` to `Marty McFly`
		if (settings.titleCase && settings.caseMc) {
			output = output.replace(/Mc(.)/g, function (m, m1) {
				return 'Mc' + m1.toUpperCase()
			})
		}

		// Handle 'O'Connor' type names
		// `Flannery O'connor` to `Flannery O'Connor`
		if (settings.titleCase && settings.caseLetterApostrophe) {
			output = output.replace(/[A-Z]\'(.)/g, function (m, m1) {
				return "O'" + m1.toUpperCase()
			})
		}

		return output
	}

	export const insightArrayToMap = (data: Record<string, any>[]) => {
		const mapped = Object.fromEntries(
			data.map((e: Record<string, any>) => {
				return [
					e[Object.keys(e).filter((e) => e !== 'count')[0]],
					Number(e[Object.keys(e).filter((e) => e === 'count')[0]]),
				]
			})
		)
		return mapped
	}
}

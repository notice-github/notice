import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { it } from './it'
import { pt } from './pt'
import { ko } from './ko'
import { ja } from './ja'
import { zhTW } from './zh-TW'
import { zh } from './zh'

export function getCurrentLang(): LangKeys {
	if (document.cookie) {
		const cookie = document.cookie
			.split('; ')
			.find((row) => row.startsWith('appLang'))
			?.split('=')[1]
		if (cookie) return cookie as LangKeys
	}

	return getLocale()
}

export function setAppLangCookie(lang: LangKeys) {
	document.cookie = `appLang=${lang};path=/`
}

// From: https://phrase.com/blog/posts/detecting-a-users-locale/
function getBrowserLocales(options = {}) {
	const defaultOptions = {
		languageCodeOnly: false,
	}
	const opt = {
		...defaultOptions,
		...options,
	}
	const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages
	if (!browserLocales) {
		return undefined
	}

	return browserLocales.map((locale) => {
		const trimmedLocale = locale.trim()
		return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
	})
}

function getLocale(): LangKeys {
	let locales = getBrowserLocales({ languageCodeOnly: true })
	if (!locales) return 'en'

	// Cast to LangKeys to avoid type error next line
	// Be aware that this typing is not perfect since locale can be any locale
	let locale = locales[0] as LangKeys

	// check that locale is included in the keys of dictionaries
	if (Object.keys(dictionaries).includes(locale)) return locale

	// fallback to english
	return 'en'
}

export const dictionaries = {
	fr,
	en,
	it,
	es,
	de,
	pt,
	ko,
	ja,
	zh,
	zhTW,
} as const

export type LangKeys = keyof typeof dictionaries

export type Dictionaries = typeof dictionaries

// Use this function outside components
export const getT = (fallback: string, key: keyof Dictionaries[LangKeys]) => {
	const lang = getCurrentLang()
	const dict = dictionaries[lang]
	return getTranslation(fallback, key, dict)
}

export function getTranslation(fallback: string, key: keyof Dictionaries[LangKeys], dict: Dictionaries[LangKeys]) {
	const translation = dict[key] as string

	return translation ?? fallback
}

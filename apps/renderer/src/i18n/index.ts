import ar from './ar'
import da from './da'
import de from './de'
import en from './en'
import es from './es'
import fr from './fr'
import ja from './ja'
import ko from './ko'
import nl from './nl'
import pt from './pt'
import zh from './zh'
import zhTW from './zh-TW'

export namespace I18n {
	export const DICTIONARIES = Object.freeze({
		en,
		fr,
		de,
		da,
		pt,
		es,
		ar,
		ko,
		ja,
		zh,
		'zh-TW': zhTW,
		nl,
	})

	export type Dictionary = (typeof DICTIONARIES)['en']
	export type WordKey = keyof (typeof DICTIONARIES)['en']
	export type LanguageCode = keyof typeof DICTIONARIES

	export const getDictionary = (lang: LanguageCode): Dictionary => {
		return DICTIONARIES[lang] ?? DICTIONARIES['en']
	}

	export const getText = (key: WordKey, lang: LanguageCode = 'en', defaultValue = ''): string => {
		return DICTIONARIES?.[lang]?.[key] || defaultValue || DICTIONARIES['en'][key] || key
	}
}

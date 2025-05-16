import { Dictionaries, LangKeys, dictionaries, getCurrentLang, getTranslation } from '../internationalisation'
import { useLangContext } from '../internationalisation/i18n.provider'

export const useT = () => {
	const { lang = 'en' } = useLangContext()
	const dict = dictionaries[lang]

	return [(fallback: string, key: keyof Dictionaries[LangKeys]) => getTranslation(fallback, key, dict)] as const
}

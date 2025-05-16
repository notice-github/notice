export namespace NLanguages {
	type NonEmptyReadOnlyArray<T> = readonly [T, ...T[]]

	/**
	 * Subset of languages that we support for intlv1.
	 */
	export const REDUCED_LANGUAGES = {
		fr: {
			code: 'fr',
			name: 'French',
			nameInOwnLanguage: 'Français',
			abbr: 'Fr',
		},
		en: {
			code: 'en',
			name: 'English',
			nameInOwnLanguage: 'English',
			abbr: 'En',
		},
		es: {
			code: 'es',
			name: 'Spanish',
			nameInOwnLanguage: 'Español',
			abbr: 'Es',
		},
		ru: {
			code: 'ru',
			name: 'Russian',
			nameInOwnLanguage: 'Pусский',
			abbr: 'Ru',
		},
		tr: {
			code: 'tr',
			name: 'Turkish',
			nameInOwnLanguage: 'Türk',
			abbr: 'Tr',
		},
		de: {
			code: 'de',
			name: 'German',
			nameInOwnLanguage: 'Deutsh',
			abbr: 'De',
		},
		it: {
			code: 'it',
			name: 'Italian',
			nameInOwnLanguage: 'Italiano',
			abbr: 'It',
		},
		pt: {
			code: 'pt',
			name: 'Portuguese',
			nameInOwnLanguage: 'Português',
			abbr: 'Pt',
		},
	} as const

	type ReducedLanguageCode = keyof typeof REDUCED_LANGUAGES

	// https://stackoverflow.com/questions/44497388/typescript-array-to-string-literal-type
	export const REDUCED_LANGUAGE_CODES = Object.keys(
		REDUCED_LANGUAGES
	) as unknown as NonEmptyReadOnlyArray<ReducedLanguageCode>
	export type REDUCED_LANGUAGE_CODES_TYPE = (typeof REDUCED_LANGUAGE_CODES)[number]

	export interface LanguageInfo {
		name: string
		countryCode: string
		languageCode: LANGUAGE_CODES_TYPE
		isRtl?: boolean
	}

	/**
	 * Languages indexed by ISO 639-1 language code
	 * https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
	 */
	export const LANGUAGES: Record<string, LanguageInfo> = {
		ab: {
			name: 'Abkhaz',
			countryCode: 'AB',
			languageCode: 'ab',
		},
		aa: {
			name: 'Afar',
			countryCode: 'ETH',
			languageCode: 'aa',
		},
		af: {
			name: 'Afrikaans',
			countryCode: 'ZAF',
			languageCode: 'af',
		},
		ak: {
			name: 'Akan',
			countryCode: 'GHA',
			languageCode: 'ak',
		},
		sq: {
			name: 'Albanian',
			countryCode: 'ALB',
			languageCode: 'sq',
		},
		am: {
			name: 'Amharic',
			countryCode: 'ETH',
			languageCode: 'am',
		},
		ar: {
			name: 'Arabic',
			countryCode: 'ARE',
			languageCode: 'ar',
			isRtl: true,
		},
		an: {
			name: 'Aragonese',
			countryCode: 'ESP',
			languageCode: 'an',
		},
		hy: {
			name: 'Armenian',
			countryCode: 'ARM',
			languageCode: 'hy',
		},
		as: {
			name: 'Assamese',
			countryCode: 'IND',
			languageCode: 'as',
		},
		av: {
			name: 'Avaric',
			countryCode: 'RUS',
			languageCode: 'av',
		},
		ae: {
			name: 'Avestan',
			countryCode: 'IRN',
			languageCode: 'ae',
		},
		ay: {
			name: 'Aymara',
			countryCode: 'BOL',
			languageCode: 'ay',
		},
		az: {
			name: 'Azerbaijani',
			countryCode: 'AZE',
			languageCode: 'az',
		},
		bm: {
			name: 'Bambara',
			countryCode: 'MLI',
			languageCode: 'bm',
		},
		ba: {
			name: 'Bashkir',
			countryCode: 'KAZ',
			languageCode: 'ba',
		},
		eu: {
			name: 'Basque',
			countryCode: 'ES ',
			languageCode: 'eu',
		},
		be: {
			name: 'Belarusian',
			countryCode: 'BLR',
			languageCode: 'be',
		},
		bn: {
			name: 'Bengali',
			countryCode: 'IND',
			languageCode: 'bn',
		},
		bh: {
			name: 'Bihari',
			countryCode: 'IND',
			languageCode: 'bh',
		},
		bi: {
			name: 'Bislama',
			countryCode: 'VUT',
			languageCode: 'bi',
		},
		bs: {
			name: 'Bosnian',
			countryCode: 'BIH',
			languageCode: 'bs',
		},
		br: {
			name: 'Breton',
			countryCode: 'FR',
			languageCode: 'br',
		},
		bg: {
			name: 'Bulgarian',
			countryCode: 'BGR',
			languageCode: 'bg',
		},
		my: {
			name: 'Burmese',
			countryCode: 'MMR',
			languageCode: 'my',
		},
		ca: {
			name: 'Catalan',
			countryCode: 'none',
			languageCode: 'ca',
		},
		ch: {
			name: 'Chamorro',
			countryCode: 'none',
			languageCode: 'ch',
		},
		ce: {
			name: 'Chechen',
			countryCode: 'RUS',
			languageCode: 'ce',
		},
		ny: {
			name: 'Chichewa',
			countryCode: 'MWI',
			languageCode: 'ny',
		},
		zh: {
			name: 'Chinese (Simplified)',
			countryCode: 'CHN',
			languageCode: 'zh',
		},
		'zh-TW': {
			name: 'Chinese (Traditional)',
			countryCode: 'CHN',
			languageCode: 'zh-TW',
		},
		cv: {
			name: 'Chuvash',
			countryCode: 'none',
			languageCode: 'cv',
		},
		kw: {
			name: 'Cornish',
			countryCode: 'GB',
			languageCode: 'kw',
		},
		co: {
			name: 'Corsican',
			countryCode: 'FR',
			languageCode: 'co',
		},
		cr: {
			name: 'Cree',
			countryCode: 'CAN',
			languageCode: 'cr',
		},
		hr: {
			name: 'Croatian',
			countryCode: 'HRV',
			languageCode: 'hr',
		},
		cs: {
			name: 'Czech',
			countryCode: 'CZE',
			languageCode: 'cs',
		},
		da: {
			name: 'Danish',
			countryCode: 'DNK',
			languageCode: 'da',
		},
		dv: {
			name: 'Divehi',
			countryCode: 'MDV',
			languageCode: 'dv',
			isRtl: true,
		},
		nl: {
			name: 'Dutch',
			countryCode: 'NLD',
			languageCode: 'nl',
		},
		en: {
			name: 'English',
			countryCode: 'GBR',
			languageCode: 'en',
		},
		eo: {
			name: 'Esperanto',
			countryCode: 'none',
			languageCode: 'eo',
		},
		et: {
			name: 'Estonian',
			countryCode: 'EST',
			languageCode: 'et',
		},
		ee: {
			name: 'Ewe',
			countryCode: 'TGO',
			languageCode: 'ee',
		},
		fo: {
			name: 'Faroese',
			countryCode: 'FRO',
			languageCode: 'fo',
		},
		fj: {
			name: 'Fijian',
			countryCode: 'FJI',
			languageCode: 'fj',
		},
		fi: {
			name: 'Finnish',
			countryCode: 'FIN',
			languageCode: 'fi',
		},
		fr: {
			name: 'French',
			countryCode: 'FR',
			languageCode: 'fr',
		},
		ff: {
			name: 'Fula',
			countryCode: 'GIN',
			languageCode: 'ff',
			isRtl: true,
		},
		gl: {
			name: 'Galician',
			countryCode: 'ESP',
			languageCode: 'gl',
		},
		ka: {
			name: 'Georgian',
			countryCode: 'GEO',
			languageCode: 'ka',
		},
		de: {
			name: 'German',
			countryCode: 'DEU',
			languageCode: 'de',
		},
		el: {
			name: 'Greek',
			countryCode: 'GRC',
			languageCode: 'el',
		},
		gn: {
			name: 'Guaraní',
			countryCode: 'PRY',
			languageCode: 'gn',
		},
		gu: {
			name: 'Gujarati',
			countryCode: 'IND',
			languageCode: 'gu',
		},
		ht: {
			name: 'Haitian',
			countryCode: 'HTI',
			languageCode: 'ht',
		},
		ha: {
			name: 'Hausa',
			countryCode: 'NGA',
			languageCode: 'ha',
		},
		he: {
			name: 'Hebrew',
			countryCode: 'ISR',
			languageCode: 'he',
			isRtl: true,
		},
		hz: {
			name: 'Herero',
			countryCode: 'NAM',
			languageCode: 'hz',
		},
		hi: {
			name: 'Hindi',
			countryCode: 'IND',
			languageCode: 'hi',
		},
		ho: {
			name: 'Hiri Motu',
			countryCode: 'PNG',
			languageCode: 'ho',
		},
		hu: {
			name: 'Hungarian',
			countryCode: 'HUN',
			languageCode: 'hu',
		},
		id: {
			name: 'Indonesian',
			countryCode: 'IDN',
			languageCode: 'id',
		},
		ga: {
			name: 'Irish',
			countryCode: 'IRL',
			languageCode: 'ga',
		},
		ig: {
			name: 'Igbo',
			countryCode: 'NGA',
			languageCode: 'ig',
		},
		ik: {
			name: 'Inupiaq',
			countryCode: 'US-AK',
			languageCode: 'ik',
		},
		io: {
			name: 'Ido',
			countryCode: 'none',
			languageCode: 'io',
		},
		is: {
			name: 'Icelandic',
			languageCode: 'is',
			countryCode: 'ISL',
		},
		it: {
			name: 'Italy',
			countryCode: 'ITA',
			languageCode: 'it',
		},
		iu: {
			name: 'Inuktitut',
			countryCode: 'CAN',
			languageCode: 'iu',
		},
		ja: {
			name: 'Japanese',
			countryCode: 'JPN',
			languageCode: 'ja',
		},
		jv: {
			name: 'Javanese',
			countryCode: 'IDN',
			languageCode: 'jv',
		},
		kl: {
			name: 'Greenlandic',
			countryCode: 'GRL',
			languageCode: 'kl',
		},
		kn: {
			name: 'Kannada',
			countryCode: 'IND',
			languageCode: 'kn',
		},
		kr: {
			name: 'Kanuri',
			countryCode: 'NER',
			languageCode: 'kr',
		},
		ks: {
			name: 'Kashmiri',
			countryCode: 'IND',
			languageCode: 'ks',
		},
		kk: {
			name: 'Kazakh',
			countryCode: 'KAZ',
			languageCode: 'kk',
		},
		km: {
			name: 'Khmer',
			countryCode: 'KHM',
			languageCode: 'km',
		},
		ki: {
			name: 'Kikuyu',
			countryCode: 'KEN',
			languageCode: 'ki',
		},
		rw: {
			name: 'Kinyarwanda',
			countryCode: 'RWA',
			languageCode: 'rw',
		},
		ky: {
			name: 'Kirghiz',
			countryCode: 'KGZ',
			languageCode: 'ky',
		},
		kv: {
			name: 'Komi',
			countryCode: 'RU',
			languageCode: 'kv',
		},
		kg: {
			name: 'Kongo',
			countryCode: 'COD',
			languageCode: 'kg',
		},
		ko: {
			name: 'Korean',
			countryCode: 'KOR',
			languageCode: 'ko',
		},
		ku: {
			name: 'Kurdish',
			countryCode: 'IRQ',
			languageCode: 'ku',
			isRtl: true,
		},
		kj: {
			name: 'Kwanyama',
			countryCode: 'AGO',
			languageCode: 'kj',
		},
		la: {
			name: 'Latin',
			countryCode: 'none',
			languageCode: 'la',
		},
		lb: {
			name: 'Letzeburgesch',
			countryCode: 'LUX',
			languageCode: 'lb',
		},
		lg: {
			name: 'Luganda',
			countryCode: 'UGA',
			languageCode: 'lg',
		},
		li: {
			name: 'Limburgish',
			countryCode: 'none',
			languageCode: 'li',
		},
		ln: {
			name: 'Lingala',
			countryCode: 'COD',
			languageCode: 'ln',
		},
		lo: {
			name: 'Lao',
			countryCode: 'LAO',
			languageCode: 'lo',
		},
		lt: {
			name: 'Lithuanian',
			countryCode: 'LTU',
			languageCode: 'lt',
		},
		lv: {
			name: 'Latvian',
			countryCode: 'LVA',
			languageCode: 'lv',
		},
		gv: {
			name: 'Manx',
			countryCode: 'none',
			languageCode: 'gv',
		},
		mk: {
			name: 'Macedonian',
			countryCode: 'MKD',
			languageCode: 'mk',
		},
		mg: {
			name: 'Malagasy',
			countryCode: 'MDG',
			languageCode: 'mg',
		},
		ms: {
			name: 'Malay',
			countryCode: 'MYS',
			languageCode: 'ms',
		},
		ml: {
			name: 'Malayalam',
			countryCode: 'IND',
			languageCode: 'ml',
		},
		mt: {
			name: 'Maltese',
			countryCode: 'MLT',
			languageCode: 'mt',
		},
		mi: {
			name: 'Māori',
			countryCode: 'NZL',
			languageCode: 'mi',
		},
		mr: {
			name: 'Marathi',
			countryCode: 'IND',
			languageCode: 'mr',
		},
		mh: {
			name: 'Marshallese',
			countryCode: 'MH',
			languageCode: 'mh',
		},
		mn: {
			name: 'Mongolian',
			countryCode: 'MNG',
			languageCode: 'mn',
		},
		na: {
			name: 'Nauru',
			countryCode: 'NR',
			languageCode: 'na',
		},
		nv: {
			name: 'Navajo',
			countryCode: 'MX',
			languageCode: 'nv',
		},
		nb: {
			name: 'Norwegia',
			countryCode: 'NOK',
			languageCode: 'nb',
		},
		nd: {
			name: 'N. Ndebele',
			countryCode: 'ZWE',
			languageCode: 'nd',
		},
		ne: {
			name: 'Nepali',
			countryCode: 'NPL',
			languageCode: 'ne',
		},
		ng: {
			name: 'Ndonga',
			countryCode: 'NAM',
			languageCode: 'ng',
		},
		no: {
			name: 'Norwegian',
			countryCode: 'NOR',
			languageCode: 'no',
		},
		ii: {
			name: 'Nuosu',
			countryCode: 'CHN',
			languageCode: 'ii',
		},
		nr: {
			name: 'S. Ndebele',
			countryCode: 'ZWE',
			languageCode: 'nr',
		},
		oc: {
			name: 'Occitan',
			countryCode: 'FR',
			languageCode: 'oc',
		},
		oj: {
			name: 'Ojibwe',
			countryCode: 'CA',
			languageCode: 'oj',
		},
		cu: {
			name: 'Church Slavic',
			countryCode: 'BLR',
			languageCode: 'cu',
		},
		om: {
			name: 'Oromo',
			countryCode: 'ET',
			languageCode: 'om',
		},
		or: {
			name: 'Oriya',
			countryCode: 'IND',
			languageCode: 'or',
		},
		os: {
			name: 'Ossetian',
			countryCode: 'IRN',
			languageCode: 'os',
		},
		pa: {
			name: 'Punjabi',
			countryCode: 'IND',
			languageCode: 'pa',
		},
		pi: {
			name: 'Pāli',
			countryCode: 'IND',
			languageCode: 'pi',
		},
		fa: {
			name: 'Persian',
			countryCode: 'IRN',
			languageCode: 'fa',
			isRtl: true,
		},
		pl: {
			name: 'Polish',
			countryCode: 'POL',
			languageCode: 'pl',
		},
		ps: {
			name: 'Pashto',
			countryCode: 'AFG',
			languageCode: 'ps',
		},
		pt: {
			name: 'Portuguese',
			countryCode: 'PRT',
			languageCode: 'pt',
		},
		qu: {
			name: 'Quechua',
			countryCode: 'COL',
			languageCode: 'qu',
		},
		rm: {
			name: 'Romansh',
			countryCode: 'CHE',
			languageCode: 'rm',
		},
		rn: {
			name: 'Kirundi',
			countryCode: 'BDI',
			languageCode: 'rn',
		},
		ro: {
			name: 'Romanian',
			countryCode: 'ROU',
			languageCode: 'ro',
		},
		ru: {
			name: 'Russian',
			countryCode: 'RUS',
			languageCode: 'ru',
		},
		sa: {
			name: 'Sanskrit',
			countryCode: 'IND',
			languageCode: 'sa',
		},
		sc: {
			name: 'Sardinian',
			countryCode: 'ITA',
			languageCode: 'sc',
		},
		sd: {
			name: 'Sindhi',
			countryCode: 'PAK',
			languageCode: 'sd',
		},
		se: {
			name: 'Northern Sami',
			countryCode: 'NOR',
			languageCode: 'se',
		},
		sm: {
			name: 'Samoan',
			countryCode: 'WSM',
			languageCode: 'sm',
		},
		sg: {
			name: 'Sango',
			countryCode: 'CAF',
			languageCode: 'sg',
		},
		sr: {
			name: 'Serbian',
			countryCode: 'SRB',
			languageCode: 'sr',
		},
		gd: {
			name: 'Scottish Gaelic',
			countryCode: 'none',
			languageCode: 'gd',
		},
		sn: {
			name: 'Shona',
			countryCode: 'ZWE',
			languageCode: 'sn',
		},
		si: {
			name: 'Sinhalese',
			countryCode: 'LKA',
			languageCode: 'si',
		},
		sk: {
			name: 'Slovak',
			countryCode: 'none',
			languageCode: 'sk',
		},
		sl: {
			name: 'Slovene',
			countryCode: 'AUT',
			languageCode: 'sl',
		},
		so: {
			name: 'Somali',
			countryCode: 'SOM',
			languageCode: 'so',
		},
		st: {
			name: 'Southern Sotho',
			countryCode: 'LSO',
			languageCode: 'st',
		},
		es: {
			name: 'Spanish',
			countryCode: 'ESP',
			languageCode: 'es',
		},
		su: {
			name: 'Sundanese',
			countryCode: 'SDN',
			languageCode: 'su',
		},
		sw: {
			name: 'Swahili',
			countryCode: 'TZA',
			languageCode: 'sw',
		},
		ss: {
			name: 'Swati',
			countryCode: 'ZAF',
			languageCode: 'ss',
		},
		sv: {
			name: 'Swedish',
			countryCode: 'SWE',
			languageCode: 'sv',
		},
		ta: {
			name: 'Tamil',
			countryCode: 'IND',
			languageCode: 'ta',
		},
		te: {
			name: 'Telugu',
			countryCode: 'IND',
			languageCode: 'te',
		},
		tg: {
			name: 'Tajik',
			countryCode: 'TJK',
			languageCode: 'tg',
		},
		th: {
			name: 'Thai',
			countryCode: 'THA',
			languageCode: 'th',
		},
		ti: {
			name: 'Tigrinya',
			countryCode: 'none',
			languageCode: 'ti',
		},
		bo: {
			name: 'Tibetan',
			countryCode: 'none',
			languageCode: 'bo',
		},
		tk: {
			name: 'Turkmen',
			countryCode: 'TKM',
			languageCode: 'tk',
		},
		tl: {
			name: 'Tagalog',
			countryCode: 'PHL',
			languageCode: 'tl',
		},
		tn: {
			name: 'Tswana',
			countryCode: 'BWA',
			languageCode: 'tn',
		},
		to: {
			name: 'Tonga',
			countryCode: 'TON',
			languageCode: 'to',
		},
		tr: {
			name: 'Turkish',
			countryCode: 'TUR',
			languageCode: 'tr',
		},
		ts: {
			name: 'Tsonga',
			countryCode: 'ZAF',
			languageCode: 'ts',
		},
		tt: {
			name: 'Tatar',
			countryCode: 'RU',
			languageCode: 'tt',
		},
		tw: {
			name: 'Twi',
			countryCode: 'GHA',
			languageCode: 'tw',
		},
		ty: {
			name: 'Tahitian',
			countryCode: 'Reo Tahiti',
			languageCode: 'ty',
		},
		ug: {
			name: 'Uighur',
			countryCode: 'none',
			languageCode: 'ug',
		},
		uk: {
			name: 'Ukrainian',
			countryCode: 'UKR',
			languageCode: 'uk',
		},
		ur: {
			name: 'Urdu',
			countryCode: 'PAK',
			languageCode: 'ur',
			isRtl: true,
		},
		uz: {
			name: 'Uzbek',
			countryCode: 'UZB',
			languageCode: 'uz',
		},
		ve: {
			name: 'Venda',
			countryCode: 'none',
			languageCode: 've',
		},
		vi: {
			name: 'Vietnamese',
			countryCode: 'VNM',
			languageCode: 'vi',
		},
		vo: {
			name: 'Volapük',
			countryCode: 'none',
			languageCode: 'vo',
		},
		wa: {
			name: 'Walloon',
			countryCode: 'BEL',
			languageCode: 'wa',
		},
		cy: {
			name: 'Welsh',
			countryCode: 'GBR',
			languageCode: 'cy',
		},
		wo: {
			name: 'Wolof',
			countryCode: 'SEN',
			languageCode: 'wo',
		},
		xh: {
			name: 'Xhosa',
			countryCode: 'none',
			languageCode: 'xh',
		},
		yi: {
			name: 'Yiddish',
			countryCode: 'ISR',
			languageCode: 'yi',
		},
		yo: {
			name: 'Yoruba',
			countryCode: 'NGA',
			languageCode: 'yo',
		},
		za: {
			name: 'Zhuang',
			countryCode: 'CHN',
			languageCode: 'za',
		},
	} as const

	type LanguageCode = keyof typeof LANGUAGES

	// https://stackoverflow.com/questions/44497388/typescript-array-to-string-literal-type
	export const LANGUAGE_CODES = Object.keys(
		LANGUAGES as Record<string, LanguageInfo>
	) as unknown as NonEmptyReadOnlyArray<LanguageCode>

	export type LANGUAGE_CODES_TYPE = (typeof LANGUAGE_CODES)[number]

	export const checkRtl = (lang: NLanguages.LANGUAGE_CODES_TYPE | undefined) => {
		return NLanguages.LANGUAGES[lang ?? 'en']?.isRtl ?? false
	}
}

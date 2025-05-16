import gcloud from '@google-cloud/translate'
import { BlockModel } from '@notice-app/models'
import { NEnv } from '@notice-app/tools'
import { Logger } from 'typerestjs'

interface TranslateOptions<T> {
	sourceLang: BlockModel.langs
	targetLang: BlockModel.langs
	input: T
}

export namespace GTranslate {
	const api = new gcloud.v3.TranslationServiceClient(
		NEnv.STAGE !== 'production' ? { credentials: JSON.parse(process.env.GCLOUD_CREDENTIALS!) } : undefined
	)

	export const text = async (options: TranslateOptions<string>) => {
		try {
			const [{ translations }] = await api.translateText({
				contents: [options.input],
				mimeType: 'text/plain',
				parent: `projects/${process.env.GCLOUD_PROJECT_ID}/locations/global`,
				sourceLanguageCode: options.sourceLang,
				targetLanguageCode: options.targetLang,
			})

			return translations![0].translatedText!
		} catch (ex: any) {
			Logger.error('service', ex, { message: 'Google Translation failed' })
		}
	}

	export const texts = async (options: TranslateOptions<string[]>) => {
		try {
			const [{ translations }] = await api.translateText({
				contents: options.input,
				mimeType: 'text/plain',
				parent: `projects/${process.env.GCLOUD_PROJECT_ID}/locations/global`,
				sourceLanguageCode: options.sourceLang,
				targetLanguageCode: options.targetLang,
			})

			return translations!.map((t) => t.translatedText!)
		} catch (ex: any) {
			Logger.error('service', ex, { message: 'Google Translation failed' })
		}
	}
}

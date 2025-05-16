import { BlockModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace TranslateSchema {
	/**
	 * @POST /translate/text
	 */
	export const text = {
		body: Is.object({
			sourceLang: BlockModel.langs,
			targetLang: BlockModel.langs,
			input: Is.string(),
		}),
		response: {
			200: Is.success(Is.string()),
			424: Is.error('translation_failed'),
		},
	} satisfies Schema
	export type text = SchemaType<typeof text>

	/**
	 * @POST /translate/texts
	 */
	export const texts = {
		body: Is.object({
			sourceLang: BlockModel.langs,
			targetLang: BlockModel.langs,
			input: Is.array(Is.string()),
		}),
		response: {
			200: Is.success(Is.array(Is.string())),
			424: Is.error('translation_failed'),
		},
	} satisfies Schema
	export type texts = SchemaType<typeof texts>

	/**
	 * @POST /translate/fullPage
	 */
	export const page = {
		body: Is.object({
			langCode: BlockModel.langs,
			langName: Is.string(),
			projectId: Is.string(),
			pageId: Is.string(),
		}),
		response: {
			200: Is.success(Is.string()),
			424: Is.error('translation_failed'),
		},
	} satisfies Schema
	export type page = SchemaType<typeof page>
}

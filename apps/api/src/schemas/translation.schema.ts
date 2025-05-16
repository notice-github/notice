import { Is, Schema, SchemaType } from 'typerestjs'

export namespace TranslationSchema {
	/**
	 * @PATCH /translation/:blockId?lang=[langCode]
	 * @params blockId
	 * @response 200 { success: true }
	 * @response 404 { error: 'block_not_found' }
	 */
	export const updateOne = {
		params: Is.object({ blockId: Is.string().uuid() }),
		body: Is.any(),
		querystring: Is.object({
			lang: Is.string().min(2).max(5),
		}),
		response: {
			200: Is.success(),
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type updateOne = SchemaType<typeof updateOne>

	/**
	 * @PATCH /translation/:pageId/title?lang=[langCode]
	 * @params pageId
	 * @response 200 { success: true }
	 * @response 404 { error: 'page_not_found' }
	 */
	export const updatePageTitle = {
		params: Is.object({ blockId: Is.string().uuid() }),
		querystring: Is.object({
			lang: Is.string().min(2).max(5),
		}),
		body: Is.object({
			text: Is.string(),
		}),
		response: {
			200: Is.success(),
			404: Is.error('page_not_found'),
		},
	} satisfies Schema
	export type updatePageTitle = SchemaType<typeof updatePageTitle>

	/**
	 * @PATCH /translation/:blockId/mark-complete?lang=[langCode]
	 * @description Mark a block as complete (e.g no more translations needed)
	 * @params blockId
	 * @response 200 { success: true }
	 * @response 404 { error: 'block_not_found' }
	 */
	export const markComplete = {
		params: Is.object({ blockId: Is.string().uuid() }),
		querystring: Is.object({
			lang: Is.string().min(2).max(5),
			complete: Is.boolean(),
		}),
		response: {
			200: Is.success(),
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type markComplete = SchemaType<typeof markComplete>
}

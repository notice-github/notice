import { Is, Schema, SchemaType } from 'typerestjs'

export namespace ImportSchema {
	/**
	 * @POST /import/markdown
	 */
	export const markdown = {
		body: Is.object({
			pageId: Is.string().uuid(),
			markdown: Is.string(),
		}),
		response: {
			200: Is.success(Is.any()),
			404: Is.error('page_not_found'),
			422: Is.error('invalid_markdown'),
		},
	} satisfies Schema
	export type markdown = SchemaType<typeof markdown>

	/**
	 * @POST /import/bms
	 */
	export const bms = {
		body: Is.object({
			pageId: Is.string().uuid(),
			bms: Is.any(),
		}),
		response: {
			200: Is.success(Is.any()),
			404: Is.error('page_not_found'),
			422: Is.error('invalid_bms'),
		},
	} satisfies Schema
	export type bms = SchemaType<typeof bms>
}

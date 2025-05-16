import { BlockModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace V1PageSchema {
	/**
	 * @GET /v1/pages/:pageId
	 */
	export const get = {
		params: Is.object({
			pageId: Is.string(),
		}),
		querystring: Is.object({
			'blocks-format': Is.enum(['json', 'markdown']).default('json'),
		}),
		response: {
			200: Is.success(BlockModel.graph),
			400: Is.error('not_a_page'),
			404: Is.error('page_not_found'),
		},
	} satisfies Schema
	export type get = SchemaType<typeof get>

	/**
	 * @GET /v1/pages/:pageId/settings
	 */
	export const settings = {
		params: Is.object({
			pageId: Is.string(),
		}),
		response: {
			200: Is.success(
				Is.object({
					preferences: BlockModel.preferences,
					colors: BlockModel.colors,
					layout: BlockModel.layout,
				}).partial()
			),
			400: Is.error('not_a_page'),
			404: Is.error('page_not_found'),
		},
	} satisfies Schema
	export type settings = SchemaType<typeof settings>

	/**
	 * @GET /v1/pages/:pageId/blocks
	 */
	export const blocks = {
		params: Is.object({
			pageId: Is.string(),
		}),
		querystring: Is.object({
			type: BlockModel.types.optional(),
			offset: Is.number().optional(),
			limit: Is.number().optional(),
		}),
		response: {
			200: Is.success(Is.array(BlockModel.block)),
			400: Is.error('not_a_page'),
			404: Is.error('page_not_found'),
		},
	} satisfies Schema
	export type blocks = SchemaType<typeof blocks>

	/**
	 * @GET /v1/pages/:pageId/seo
	 */
	export const seo = {
		params: Is.object({
			pageId: Is.string(),
		}),
		response: {
			200: Is.success(
				Is.array(
					Is.object({
						tagName: Is.string(),
						attributes: Is.record(Is.string(), Is.string().or(Is.boolean())).optional(),
						innerText: Is.string().optional(),
						innerHTML: Is.string().optional(),
					})
				)
			),
			400: Is.error('not_a_page'),
			404: Is.error('page_not_found'),
		},
	} satisfies Schema
	export type seo = SchemaType<typeof seo>
}

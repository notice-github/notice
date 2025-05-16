import { BlockModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace PublishedBlockSchema {
	/**
	 * @GET /published-blocks/:blockIdOrDomain
	 */
	export const get = {
		params: Is.object({ blockIdOrDomain: Is.string() }),
		querystring: Is.object({
			raw: Is.boolean().default(false),
			pagelang: Is.string().optional(),
			browserlang: Is.string().optional(),
			attrlang: Is.string().optional(),
			querylang: Is.string().optional(),
			lang: Is.string().nullable().optional(),
		}),
		response: {
			200: BlockModel.graph,
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type get = SchemaType<typeof get>

	/**
	 * @GET /published-blocks/:blockId/state
	 */
	export const getState = {
		params: Is.object({ blockId: Is.string().uuid() }),
		response: {
			200: Is.success(Is.enum(['not_published', 'out_of_date', 'up_to_date'] as const)),
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type getState = SchemaType<typeof getState>

	/**
	 * @GET /published-blocks/:blockIdOrDomain/page
	 */
	export const getPage = {
		params: Is.object({ blockIdOrDomain: Is.string() }),
		querystring: Is.object({
			raw: Is.boolean().default(false),
			pagelang: Is.string().optional(),
			browserlang: Is.string().optional(),
			attrlang: Is.string().optional(),
			querylang: Is.string().optional(),
			lang: Is.string().nullable().optional(),
		}),
		response: {
			200: BlockModel.page,
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type getPage = SchemaType<typeof getPage>
}

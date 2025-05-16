import { Is, Schema, SchemaType } from 'typerestjs'

export namespace BodySchema {
	/**
	 * @GET /body/:target
	 */
	export const get = {
		params: Is.object({
			target: Is.string(),
		}),
		querystring: Is.object({
			mode: Is.enum(['draft', 'public']).default('public'),
			format: Is.enum(['html', 'markdown', 'fragmented']).default('html'),
			layout: Is.enum(['empty', 'page', 'full']).default('full'),
			background: Is.string().optional(),
		}),
		response: {
			200: Is.string(),
			404: Is.error('target_not_found'),
		},
	} satisfies Schema
	export type get = SchemaType<typeof get>
}

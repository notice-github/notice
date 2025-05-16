import { Is, Schema, SchemaType } from 'typerestjs'

export namespace DocumentSchema {
	/**
	 * @GET /document/:target
	 */
	export const get = {
		params: Is.object({
			target: Is.string(),
		}),
		querystring: Is.object({
			page: Is.string()
				.or(Is.number())
				.transform((val) => val.toString())
				.optional(),
			mode: Is.enum(['draft', 'public']).default('public'),
			format: Is.enum(['html', 'markdown', 'fragmented', 'article-md', 'article-json']).default('html'),
			navigationType: Is.enum(['slash', 'query', 'memory']).optional(),
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

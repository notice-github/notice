import { Is, Schema, SchemaType } from 'typerestjs'

// ! @deprecated
export namespace PageSchema {
	/**
	 * @GET /pages/:target/full
	 */
	export const full = {
		params: Is.object({
			target: Is.string(),
		}),
		querystring: Is.object({
			format: Is.enum(['html']).default('html'),
			page: Is.string()
				.or(Is.number())
				.transform((val) => val.toString())
				.optional(),
			mode: Is.enum(['draft', 'public']).default('public'),
			navigationType: Is.enum(['slash', 'query', 'memory']).optional(),
		}),
		response: {
			200: Is.object({
				head: Is.string(),
				styles: Is.string(),
				scripts: Is.string(),
				body: Is.string(),
			}),
			404: Is.error('target_not_found'),
		},
	} satisfies Schema
	export type full = SchemaType<typeof full>

	/**
	 * @GET /pages/:target/update
	 */
	export const update = {
		params: Is.object({
			target: Is.string(),
		}),
		querystring: Is.object({
			format: Is.enum(['html']).default('html'),
			page: Is.string()
				.or(Is.number())
				.transform((val) => val.toString())
				.optional(),
			mode: Is.enum(['draft', 'public']).default('public'),
			navigationType: Is.enum(['slash', 'query', 'memory']).optional(),
		}),
		response: {
			200: Is.object({
				header: Is.string().optional(),
				left: Is.string().optional(),
				top: Is.string().optional(),
				content: Is.string(),
				bottom: Is.string().optional(),
				right: Is.string().optional(),
			}),
			404: Is.error('target_not_found'),
		},
	} satisfies Schema
	export type update = SchemaType<typeof update>
}

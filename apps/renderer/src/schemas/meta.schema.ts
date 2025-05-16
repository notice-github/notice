import { Is, Schema, SchemaType } from 'typerestjs'

export namespace MetaSchema {
	/**
	 * @GET /meta/:target/sitemap.txt
	 */
	export const sitemap = {
		params: Is.object({
			target: Is.string(),
		}),
		querystring: Is.object({
			host: Is.string().optional(),
		}),
		response: {
			200: Is.string(),
			404: Is.error('target_not_found', 'host_not_found'),
		},
	} satisfies Schema
	export type sitemap = SchemaType<typeof sitemap>

	/**
	 * @GET /meta/:target/robots.txt
	 */
	export const robots = {
		params: Is.object({
			target: Is.string(),
		}),
		querystring: Is.object({
			host: Is.string().optional(),
		}),
		response: {
			200: Is.string(),
			404: Is.error('target_not_found', 'host_not_found'),
		},
	} satisfies Schema
	export type robots = SchemaType<typeof robots>
}

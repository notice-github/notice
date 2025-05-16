import { Is, Schema, SchemaType } from 'typerestjs'

export namespace AuthSchema {
	/**
	 * @GET /auth/:provider
	 * @POST /auth/email
	 */
	export const auth = {
		querystring: Is.object({
			source: Is.string().optional(),
			next: Is.string().optional(),
		}),
		response: {
			200: Is.success(),
			302: Is.undefined(), // This is a redirect
			401: Is.error('wrong_code'),
		},
	} satisfies Schema
	export type auth = SchemaType<typeof auth>

	/**
	 * @POST /auth/email/resend
	 */
	export const resend = {
		body: Is.object({
			email: Is.string().email(),
		}),
		response: {
			201: Is.success(),
		},
	} satisfies Schema
	export type resend = SchemaType<typeof resend>

	/**
	 * @GET /auth/:provider/link
	 */
	export const link = {
		params: Is.object({ provider: Is.enum(['google', 'github']) }),
		querystring: Is.object({ next: Is.string().optional() }),
		response: {
			302: Is.undefined(), // This is a redirect
		},
	} satisfies Schema
	export type link = SchemaType<typeof link>

	/**
	 * @POST /auth/:provider/unlink
	 */
	export const unlink = {
		params: Is.object({ provider: Is.enum(['google', 'github']) }),
		response: {
			200: Is.success(),
			404: Is.error('provider_not_linked'),
		},
	}
	export type unlink = SchemaType<typeof unlink>
}

import {} from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace BillingSchema {
	/**
	 * @GET /billing/:workspaceId
	 */
	export const get = {
		params: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(
				Is.object({
					invoices: Is.array(
						Is.object({
							invoiceId: Is.string(),
							date: Is.date(),
							total: Is.number(),
							status: Is.string(),
							link: Is.string().nullable(),
						})
					),
					upcoming: Is.object({
						total: Is.number(),
						date: Is.date(),
					}).optional(),
				})
			),
			404: Is.error('no_subscription'),
		},
	} satisfies Schema
	export type get = SchemaType<typeof get>

	/**
	 * @GET /billing/:workspaceId/details
	 */
	export const details = {
		params: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(Is.string().url()),
			404: Is.error('no_subscription'),
		},
	} satisfies Schema
	export type details = SchemaType<typeof details>
}

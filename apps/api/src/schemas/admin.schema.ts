import { SubscriptionModel, UserModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace AdminSchema {
	/**
	 * @GET /admin/user
	 */
	export const user = {
		response: {
			200: Is.success(
				UserModel.client.extend({
					isFake: Is.boolean().optional(),
				})
			),
		},
	} satisfies Schema
	export type user = SchemaType<typeof user>

	/**
	 * @POST /admin/connect/as/:userId
	 */
	export const connectAs = {
		params: Is.object({
			userId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(),
			404: Is.error('user_not_found'),
		},
	} satisfies Schema
	export type connectAs = SchemaType<typeof connectAs>

	/**
	 * @GET /admin/users
	 */
	export const users = {
		querystring: Is.object({
			query: Is.string().trim().optional(),
		}),
		response: {
			200: Is.success(Is.array(UserModel.full)),
		},
	} satisfies Schema
	export type users = SchemaType<typeof users>

	/**
	 * @POST /admin/free-trial
	 */
	export const freeTrial = {
		body: Is.object({
			userId: Is.string().uuid(),
			timeInMonth: Is.number().min(1),
		}),
		response: {
			200: Is.success(SubscriptionModel.full),
			404: Is.error('user_not_found').or(Is.error('workspace_not_found')),
			409: Is.error('already_subscribed'),
		},
	} satisfies Schema
	export type freeTrial = SchemaType<typeof freeTrial>
}

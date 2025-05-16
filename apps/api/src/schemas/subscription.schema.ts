import { LicenceModel, SubscriptionModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace SubscriptionSchema {
	/**
	 * @POST /subscriptions/:workspaceId/subscribe
	 */
	export const subscribe = {
		params: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		body: Is.object({
			type: SubscriptionModel.type,
			billingCycle: SubscriptionModel.billingCycle,
			coupon: Is.string().nullable().optional(),
		}),
		response: {
			200: Is.success(Is.object({ checkoutUrl: Is.string() })),
			400: Is.error('bad_session'),
			409: Is.error('already_subscribe'),
		},
	} satisfies Schema
	export type subscribe = SchemaType<typeof subscribe>

	/**
	 * @POST /subscriptions/:workspaceId/reactivate
	 */
	export const reactivate = {
		params: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(SubscriptionModel.full),
			409: Is.error('already_subscribe').or(Is.error('no_subscription')),
		},
	} satisfies Schema
	export type reactivate = SchemaType<typeof reactivate>

	/**
	 * @GET /subscriptions/:workspaceId
	 */
	export const get = {
		params: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(SubscriptionModel.full),
			404: Is.error('subscription_not_found'),
		},
	} satisfies Schema
	export type get = SchemaType<typeof get>

	/**
	 * @GET /subscriptions/:workspaceId/license
	 */
	export const license = {
		params: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(LicenceModel.full),
			404: Is.error('license_not_found'),
		},
	} satisfies Schema
	export type license = SchemaType<typeof license>

	/**
	 * @PATCH /subscriptions/:workspaceId/billing-cycle
	 */
	export const updateBillingCycle = {
		params: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		querystring: Is.object({
			value: SubscriptionModel.billingCycle,
		}),
		response: {
			200: Is.success(Is.undefined()),
			404: Is.error('subscription_not_found'),
		},
	} satisfies Schema
	export type updateBillingCycle = SchemaType<typeof updateBillingCycle>
}

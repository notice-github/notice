import { SubscriptionModel } from '@notice-app/models'
import { Postgres } from '@notice-app/postgres'
import { Handler } from 'typerestjs'
import { SubscriptionSchema } from '../schemas/subscription.schema'
import { SubscriptionService } from '../services/subscription.service'
import { Consts } from '../tools/consts'

export namespace SubscriptionController {
	export const subscribe: Handler<SubscriptionSchema.subscribe> = async (req, reply) => {
		const subscription = await SubscriptionService.getSubscription(req.params.workspaceId)

		if (subscription != null && !subscription.isFreeTrial) return reply.error(409, 'already_subscribe')

		if (Consts.BANNED_DOMAINS[req.user.email.split('@')[1]]) {
			return reply.success(200, { checkoutUrl: '' })
		}
		
		const session = await SubscriptionService.createSession(req.params.workspaceId, req.user, {
			type: req.body.type,
			billingCycle: req.body.billingCycle as Exclude<SubscriptionModel.billingCycle, 'lifetime'>,
			coupon: req.body.coupon,
		})
		if (session == null || session.url == null) return reply.error(400, 'bad_session')

		return reply.success(200, { checkoutUrl: session.url })
	}

	export const reactivate: Handler<SubscriptionSchema.reactivate> = async (req, reply) => {
		const subscription = await SubscriptionService.getSubscription(req.params.workspaceId)
		if (subscription == null) return reply.error(409, 'no_subscription')

		if (!subscription.expiresAt) return reply.error(409, 'already_subscribe')

		await SubscriptionService.reactivateSubscription(subscription)

		return reply.success(200, { ...subscription, expiresAt: null })
	}

	export const get: Handler<SubscriptionSchema.get> = async (req, reply) => {
		const subscription = await SubscriptionService.getSubscription(req.params.workspaceId)
		if (subscription == null) return reply.error(404, 'subscription_not_found')

		return reply.success(200, subscription)
	}

	export const license: Handler<SubscriptionSchema.license> = async (req, reply) => {
		const license = await Postgres.licenses().where('workspaceId', req.params.workspaceId).first()
		if (license == null) return reply.error(404, 'license_not_found')

		return reply.success(200, license)
	}
}

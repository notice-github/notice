import { Handler } from 'typerestjs'
import { BillingSchema } from '../schemas/billing.schema'
import { BillingService } from '../services/billing.service'
import { SubscriptionService } from '../services/subscription.service'

export namespace BillingController {
	export const get: Handler<BillingSchema.get> = async (req, reply) => {
		const { workspaceId } = req.params

		const subscription = await SubscriptionService.getSubscription(workspaceId)
		if (!subscription?.stripeId) return reply.error(404, 'no_subscription')

		const [invoices, upcoming] = await Promise.all([
			BillingService.fetchInvoices(subscription.stripeId),
			BillingService.fetchUpcomingInvoice(subscription.stripeId),
		])

		return reply.success(200, { invoices, upcoming })
	}

	export const details: Handler<BillingSchema.details> = async (req, reply) => {
		const { workspaceId } = req.params

		const subscription = await SubscriptionService.getSubscription(workspaceId)
		if (!subscription?.stripeId) return reply.error(404, 'no_subscription')

		const customerId = await BillingService.fetchCustomerId(subscription.stripeId)
		if (!customerId) return reply.error(404, 'no_subscription')

		const session = await BillingService.createPortalSession(customerId, workspaceId)

		return reply.success(200, session.url)
	}
}

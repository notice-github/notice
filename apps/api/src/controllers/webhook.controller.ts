import { Postgres } from '@notice-app/postgres'
import { NEnv, NTime } from '@notice-app/tools'
import { Handler } from 'typerestjs'
import { Stripe } from '../plugins/stripe.plugin'
import { WebhookSchema } from '../schemas/webhook.schema'

export namespace WebhookController {
	export const stripe: Handler<WebhookSchema.stripe> = async (req, reply) => {
		try {
			const event = Stripe.sdk.webhooks.constructEvent(
				req.rawBody!,
				req.headers['stripe-signature']!,
				process.env.STRIPE_WEBHOOK_SECRET!
			)

			const data: any = event.data.object

			switch (event.type) {
				case 'checkout.session.completed': {
					const { stage, type, billingCycle, referral } = data.metadata
					const [userId, workspaceId] = data.client_reference_id.split('__')

					if (stage !== NEnv.STAGE) break

					if (referral) {
						const { customer } = data
						await Stripe.sdk.customers.update(customer, { metadata: { referral } })
					}

					const subscription = await Postgres.subscriptions().select('id').where('workspaceId', workspaceId).first()
					if (subscription == null) {
						await Postgres.subscriptions().insert({
							id: Postgres.uuid(),
							stripeId: data.subscription,
							type: type,
							userId: userId,
							workspaceId: workspaceId,
							billingCycle: billingCycle,
						})
					} else {
						await Postgres.subscriptions().where('id', subscription.id).update({
							stripeId: data.subscription,
							type: type,
							userId: userId,
							billingCycle: billingCycle,
							isFreeTrial: false,
							expiresAt: null,
						})
					}

					break
				}
				case 'customer.subscription.deleted': {
					const subscription = await Postgres.subscriptions().select('id', 'userId').where('stripeId', data.id).first()
					if (subscription == null) break

					await Postgres.subscriptions().where('id', subscription.id).delete()

					break
				}
				case 'customer.subscription.updated': {
					if (data.status === 'active') {
						await Postgres.subscriptions()
							.where('stripeId', data.id)
							.update({ expiresAt: data.cancel_at != null ? NTime.$from(data.cancel_at * 1000).toDate() : null })
					}
				}
			}

			return reply.custom().status(200).send()
		} catch (ex: any) {
			return reply.custom().status(400).send(`Webhook Error: ${ex.message}`)
		}
	}
}

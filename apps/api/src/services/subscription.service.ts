import { SubscriptionModel, UserModel } from '@notice-app/models'
import { Postgres } from '@notice-app/postgres'
import { NEnv, NTime, NUrls } from '@notice-app/tools'
import { readFile } from 'fs/promises'
import Papa from 'papaparse'
import { Stripe } from '../plugins/stripe.plugin'
import { Consts } from '../tools/consts'

export namespace SubscriptionService {
	const PRICES: {
		[key: string]: {
			monthly: { id: string; amount: number }
			yearly: { id: string; amount: number }
		}
	} = {}
	export const getPrice = async (type: string, billingCycle: Exclude<SubscriptionModel.billingCycle, 'lifetime'>) => {
		if (Object.keys(PRICES).length === 0) {
			const keys = SubscriptionModel.TYPES.filter((t) => t !== 'free' && t !== 'enterprise')
				.map((t) => [`${t}_monthly`, `${t}_yearly`])
				.reduce((acc, curr) => [...acc, ...curr], [])

			const { data } = await Stripe.sdk.prices.list({
				lookup_keys: keys,
				active: true,
			})

			for (let { id, lookup_key, unit_amount } of data) {
				if (!lookup_key || unit_amount == undefined) continue

				const [name, cycle] = lookup_key.split('_')
				PRICES[name] = {
					...PRICES[name],
					[cycle]: {
						id,
						amount: unit_amount / 100,
					},
				}
			}
		}

		return PRICES[type][billingCycle]
	}

	const FEATURES: {
		[key: string]: {
			[key: string]: number | boolean
		}
	} = {}
	export const getFeature = async <T extends boolean | number = boolean>(id: string, plan: string): Promise<T> => {
		if (Object.keys(FEATURES).length === 0) {
			const content = (await readFile('./assets/plans_features.csv')).toString()
			const features = Papa.parse<any>(content, { header: true }).data

			for (let feature of features) {
				if (Object.keys(feature).length < 2) continue

				const { id, name, ...plans } = feature

				FEATURES[id] = {
					...Object.fromEntries(
						Object.entries<any>(plans).map(([plan, value]) => {
							if (value === 'true' || value === 'on') value = true
							else if (value === 'false' || value === 'off') value = false
							else if (value === 'custom' || value === 'all') value = Infinity
							else if (!Number.isNaN(value)) value = parseInt(value)

							return [plan, value]
						})
					),
				}
			}
		}

		return FEATURES[id][plan] as T
	}

	export const getSubscription = async (workspaceId: string) => {
		const subscription = await Postgres.subscriptions()
			.where('workspaceId', workspaceId)
			.andWhere((builder) => builder.where('expiresAt', '>', NTime.now()).orWhereNull('expiresAt'))
			.first()

		return subscription
	}

	export const getActiveSubscription = async (workspaceId: string) => {
		const subscription = await Postgres.subscriptions()
			.where('workspaceId', workspaceId)
			.where('isFreeTrial', false)
			.whereNull('expiresAt')
			.first()

		return subscription
	}

	export const createSession = async (
		workspaceId: string,
		user: Pick<UserModel.full, 'id' | 'email'>,
		options: {
			type: SubscriptionModel.type
			billingCycle: Exclude<SubscriptionModel.billingCycle, 'lifetime'>
			coupon?: string | null
		}
	) => {
		const price = await getPrice(options.type, options.billingCycle)
		if (!price) return null

		const currentSubscription = await getSubscription(workspaceId)
		if (currentSubscription != null && !currentSubscription.isFreeTrial) return null

		const session = await Stripe.sdk.checkout.sessions.create({
			mode: 'subscription',
			metadata: {
				stage: NEnv.STAGE,
				userEmail: user.email,
				type: options.type,
				billingCycle: options.billingCycle,
			},
			discounts: options.coupon ? [{ coupon: options.coupon }] : undefined,
			client_reference_id: `${user.id}__${workspaceId}`,
			allow_promotion_codes: options.coupon ? undefined : true,
			automatic_tax: { enabled: true },
			billing_address_collection: 'required',
			tax_id_collection: { enabled: true },
			line_items: [{ price: price.id, quantity: 1 }],
			customer_email: user.email,
			success_url: `${NUrls.App.client()}/editor/subscription-success?workspace=${workspaceId}`,
			cancel_url: `${NUrls.App.client()}/editor/settings/subscription?workspace=${workspaceId}${
				options.coupon ? `&coupon=${options.coupon}` : ''
			}`,
		})

		return session
	}

	export const createFreeTrial = async (
		workspaceId: string,
		user: Pick<UserModel.full, 'id' | 'email' | 'username'>,
		timeInMonth: number
	) => {
		let customer = (await Stripe.sdk.customers.search({ query: `email:'${user.email}'` })).data[0]
		if (!customer) {
			customer = await Stripe.sdk.customers.create({
				email: user.email,
				name: user.username,
			})
		}

		const price = await getPrice('teams', 'monthly')
		if (price == null) return null

		const stripe = await Stripe.sdk.subscriptions.create({
			customer: customer.id,
			items: [{ price: price.id, quantity: 1 }],
			trial_end: NTime.$now().add(timeInMonth, 'months').unix(),
		})

		const [subscription] = await Postgres.subscriptions()
			.insert({
				id: Postgres.uuid(),
				stripeId: stripe.id,
				type: 'teams',
				userId: user.id,
				workspaceId: workspaceId,
				billingCycle: 'monthly',
			})
			.returning('*')

		return subscription
	}

	export const updateBillingCycle = async (
		subscription: SubscriptionModel.full,
		billingCycle: SubscriptionModel.billingCycle
	) => {
		// TODO
	}

	export const cancelSubscription = async (subscription: SubscriptionModel.full) => {
		if (subscription.stripeId == null) return
		await Stripe.sdk.subscriptions.update(subscription.stripeId, { cancel_at_period_end: true })
	}

	export const reactivateSubscription = async (subscription: SubscriptionModel.full) => {
		if (subscription.stripeId == null) return
		await Stripe.sdk.subscriptions.update(subscription.stripeId, { cancel_at_period_end: false })
	}

	export const expiresOne = async (id: string) => {
		await Postgres.subscriptions()
			.where('id', id)
			.update({ expiresAt: NTime.$now().subtract(1, 'minute').toDate() })
	}

	export const deleteOne = async (id: string) => {
		await Postgres.subscriptions().where('id', id).delete()
	}
}

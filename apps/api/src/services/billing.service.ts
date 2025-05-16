import { NTime, NUrls } from '@notice-app/tools'
import { Stripe } from '../plugins/stripe.plugin'

export namespace BillingService {
	export const fetchInvoices = async (stripeId: string, limit: number = 100) => {
		const invoices = await Stripe.sdk.invoices.list({ subscription: stripeId, limit: limit })

		return invoices.data.map((invoice, index) => ({
			invoiceId: invoice.number ?? `${index}`.padStart(7, '0'),
			date: NTime.from(invoice.created * 1000),
			total: invoice.total / 100,
			status: invoice.amount_remaining === 0 ? 'Paid' : 'Unpaid',
			link: invoice.hosted_invoice_url ?? null,
		}))
	}

	export const fetchUpcomingInvoice = async (stripeId: string) => {
		try {
			const upcoming = await Stripe.sdk.invoices.retrieveUpcoming({ subscription: stripeId })

			return {
				total: upcoming.total / 100,
				date: NTime.from((upcoming.next_payment_attempt ?? 0) * 1000),
			}
		} catch (ex) {}
	}

	export const fetchCustomerId = async (stripeId: string) => {
		const subscription = await Stripe.sdk.subscriptions.retrieve(stripeId)
		return subscription.customer.toString()
	}

	export const createPortalSession = async (customerId: string, workspaceId: string) => {
		return await Stripe.sdk.billingPortal.sessions.create({
			customer: customerId,
			return_url: `${NUrls.App.client()}/editor/settings/billing?workspace=${workspaceId}`,
		})
	}
}

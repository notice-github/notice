import StripeSDK from 'stripe'

export namespace Stripe {
	export const sdk = new StripeSDK(process.env.STRIPE_API_KEY!, {
		apiVersion: '2022-11-15',
		typescript: true,
	})

	export type Invoice = StripeSDK.Invoice
	export type UpcomingInvoice = StripeSDK.UpcomingInvoice
}

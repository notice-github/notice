import { Is, ModelType } from 'typerestjs'

export namespace SubscriptionModel {
	//-----------//
	// All parts //
	//-----------//

	export const TYPES = ['free', 'individual', 'essential', 'teams', 'enterprise'] as const
	export const type = Is.enum(TYPES)
	export type type = ModelType<typeof type>

	export const billingCycle = Is.enum(['monthly', 'yearly', 'lifetime'] as const)
	export type billingCycle = ModelType<typeof billingCycle>

	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */
	export const full = Is.object({
		id: Is.string().uuid(),
		type: type,

		stripeId: Is.string().nullable(),
		billingCycle: billingCycle,
		isFreeTrial: Is.boolean().default(false),

		userId: Is.string().uuid().nullable(),
		workspaceId: Is.string().uuid(),

		createdAt: Is.date(),
		updatedAt: Is.date(),
		expiresAt: Is.date().nullable(),
	})
	export type full = ModelType<typeof full>

	//--------------//
	// Create Table //
	//--------------//

	export const table = (table: any, helpers: any) => {
		table.uuid('id').primary()

		table.enum('type', ['free', 'individual', 'essential', 'teams', 'enterprise'])

		table.string('stripeId').nullable()
		table.enum('billingCycle', ['monthly', 'yearly', 'lifetime'])
		table.boolean('isFreeTrial').defaultTo(false)

		table.uuid('userId').nullable()
		table.foreign('userId').references('users.id')
		table.uuid('workspaceId')
		table.foreign('workspaceId').references('workspaces.id')

		table.dateTime('createdAt').defaultTo(helpers.now())
		table.dateTime('updatedAt').defaultTo(helpers.now())
		table.dateTime('expiresAt').nullable()
	}
}

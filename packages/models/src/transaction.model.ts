import { Is, ModelType } from 'typerestjs'

export namespace TransactionModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */
	export const full = Is.object({
		id: Is.string().uuid(),

		type: Is.enum(['token'] as const),
		source: Is.string(),
		amount: Is.number().int(),

		userId: Is.string().uuid().nullable(),
		workspaceId: Is.string().uuid(),

		createdAt: Is.date(),
	})
	export type full = ModelType<typeof full>

	//--------------//
	// Create Table //
	//--------------//

	export const table = (table: any, helpers: any) => {
		table.uuid('id').primary()

		table.enum('type', ['token']).index()
		table.string('source')
		table.integer('amount')

		table.uuid('userId').nullable()
		table.foreign('userId').references('users.id')
		table.uuid('workspaceId')
		table.foreign('workspaceId').references('workspaces.id')

		table.dateTime('createdAt').defaultTo(helpers.now()).index()
	}
}

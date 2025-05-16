import { Is, ModelType } from 'typerestjs'

export namespace LicenceModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */
	export const full = Is.object({
		id: Is.string().uuid(),

		planId: Is.string(),
		licenseId: Is.string().uuid().nullable(),
		activationEmail: Is.string(),
		invoiceItemId: Is.string().uuid(),

		workspaceId: Is.string().uuid().nullable(),

		createdAt: Is.date(),
	})
	export type full = ModelType<typeof full>

	//--------------//
	// Create Table //
	//--------------//

	export const table = (table: any, helpers: any) => {
		table.uuid('id').primary()

		table.string('planId')
		table.uuid('licenseId').nullable()
		table.string('activationEmail', 320).unique()
		table.uuid('invoiceItemId')

		table.uuid('workspaceId').nullable()
		table.foreign('workspaceId').references('workspaces.id')

		table.dateTime('createdAt').defaultTo(helpers.now())
	}
}

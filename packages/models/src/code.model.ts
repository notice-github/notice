import { Is, ModelType } from 'typerestjs'

export namespace CodeModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */
	export const full = Is.object({
		id: Is.string().uuid(),

		email: Is.string(),
		code: Is.string(),

		createdAt: Is.date(),
		expiresAt: Is.date(),
	})
	export type full = ModelType<typeof full>

	//--------------//
	// Create Table //
	//--------------//

	export const table = (table: any, helpers: any) => {
		table.uuid('id').primary()

		table.string('email', 320)
		table.string('code')

		table.dateTime('createdAt').defaultTo(helpers.now())
		table.dateTime('expiresAt')
	}
}

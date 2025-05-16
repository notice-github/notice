import { Is, ModelType } from 'typerestjs'

export namespace UserModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */
	export const full = Is.object({
		id: Is.string().uuid(),

		// Auth
		email: Is.string(),
		googleId: Is.string().nullable(),
		githubId: Is.string().nullable(),

		username: Is.string(),
		picture: Is.string().nullable(),

		activeAt: Is.date().nullable(),

		formIsFilled: Is.boolean().default(false),

		createdAt: Is.date(),
		updatedAt: Is.date(),
	})
	export type full = ModelType<typeof full>

	/**
	 * The model available to the client
	 */
	export const client = full.pick({
		id: true,
		email: true,
		username: true,
		picture: true,
		githubId: true,
		googleId: true,
		formIsFilled: true,
		createdAt: true,
	})
	export type client = ModelType<typeof client>

	/**
	 * The input model that is use by controllers
	 */
	export const input = full
		.omit({
			id: true,
			createdAt: true,
			updatedAt: true,
		})
		.partial()
		.merge(full.pick({ email: true }))
	export type input = ModelType<typeof input>

	export const form = Is.object({
		firstname: Is.string(),
		lastname: Is.string(),
		phoneNumber: Is.string(),
		countryCode: Is.string(),
		companyName: Is.string(),
		companySize: Is.number(),
		role: Is.string(),
	})
	export type form = ModelType<typeof form>

	//--------------//
	// Create Table //
	//--------------//
	export const table = (table: any, helpers: any) => {
		table.uuid('id').primary()

		table.string('email', 320).unique({ indexName: 'users_email_unique' })
		table.string('googleId').nullable()
		table.string('githubId').nullable()

		table.string('username')
		table.text('picture').nullable()

		table.dateTime('activeAt').nullable()

		table.boolean('formIsFilled').defaultTo(false)

		table.dateTime('createdAt').defaultTo(helpers.now())
		table.dateTime('updatedAt').defaultTo(helpers.now())
	}
}

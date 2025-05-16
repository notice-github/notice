import { UserModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace UserSchema {
	/**
	 * @GET /user
	 */
	export const get = {
		response: {
			200: Is.success(UserModel.client),
		},
	} satisfies Schema
	export type get = SchemaType<typeof get>

	/**
	 * @PATCH /user
	 */
	export const update = {
		body: UserModel.full.pick({ picture: true, username: true, formIsFilled: true }).partial(),
		response: {
			200: Is.success(UserModel.client),
		},
	} satisfies Schema
	export type update = SchemaType<typeof update>

	/**
	 * @POST /user/form
	 */
	export const form = {
		body: Is.object({
			firstname: Is.string(),
			lastname: Is.string(),
			phoneNumber: Is.string(),
			countryCode: Is.string(),
			companyName: Is.string(),
			companySize: Is.number(),
			role: Is.string(),
		}),
		response: {
			200: Is.success(Is.string()),
		},
	} satisfies Schema
	export type form = SchemaType<typeof form>
}

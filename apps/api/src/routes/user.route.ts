import { Route } from 'typerestjs'
import { UserController } from '../controllers/user.controller'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { UserSchema } from '../schemas/user.schema'

export namespace UserRoute {
	export const PREFIX = '/user'

	export const get: Route<UserSchema.get> = {
		method: 'GET',
		path: '/',
		schema: UserSchema.get,
		middlewares: [GuardMiddleware.connected()],
		handler: UserController.get,
	}

	export const update: Route<UserSchema.update> = {
		method: 'PATCH',
		path: '/',
		schema: UserSchema.update,
		middlewares: [GuardMiddleware.connected()],
		handler: UserController.update,
	}

	export const form: Route<UserSchema.form> = {
		method: 'POST',
		path: '/form',
		schema: UserSchema.form,
		middlewares: [GuardMiddleware.connected()],
		handler: UserController.form,
	}
}

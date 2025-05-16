import { Handler } from 'typerestjs'
import { UserSchema } from '../schemas/user.schema'
import { UserService } from '../services/user.service'

export namespace UserController {
	export const get: Handler<UserSchema.get> = async (req, reply) => {
		// Pssively update user last activity date
		UserService.isActive(req.user.id)

		return reply.success(200, req.user)
	}

	export const update: Handler<UserSchema.update> = async (req, reply) => {
		const updatedUser = await UserService.update(req.user.id, req.body)
		return reply.success(200, updatedUser)
	}

	export const form: Handler<UserSchema.form> = async (req, reply) => {
		await UserService.update(req.user.id, { formIsFilled: true })
		const updatedUser = await UserService.sendForm(req.user.id, req.body)
		return reply.success(200, updatedUser)
	}
}

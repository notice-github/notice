import { Handler, Logger } from 'typerestjs'
import { TrackerSchema } from '../schemas/tracker.schema'

class CustomError extends Error {
	constructor(name: string, message: string, stack?: string) {
		super(message)
		this.name = name
		this.stack = stack
	}
}

export namespace TrackerController {
	export const event: Handler<TrackerSchema.event> = async (req, reply) => {
		const { id, eventName, data } = req.body
		return reply.success('200')
	}

	export const crash: Handler<TrackerSchema.crash> = async (req, reply) => {
		const { name, message, stack } = req.body

		Logger.error('crash', new CustomError(name, message, stack), { ...req.body.metadata, from: 'client' })

		return reply.success(200)
	}
}

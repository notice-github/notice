// import { TrackerController } from '@/controllers/tracker.controller'
import { Route } from 'typerestjs'
import { TrackerSchema } from '../schemas/tracker.schema'
import { TrackerController } from '../controllers/tracker.controller'

export namespace TrackerRoute {
	export const PREFIX = '/tracker'

	export const event: Route<TrackerSchema.event> = {
		method: 'POST',
		path: '/event',
		schema: TrackerSchema.event,
		handler: TrackerController.event,
	}

	export const crash: Route<TrackerSchema.crash> = {
		method: 'POST',
		path: '/crash',
		schema: TrackerSchema.crash,
		handler: TrackerController.crash,
	}
}

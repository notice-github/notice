import { BMSBlockModel, SubscriptionModel } from '@notice-app/models'
import { MongoDB } from '@notice-app/mongodb'
import { NEnv } from '@notice-app/tools'
import { Middleware } from 'typerestjs'
import { SubscriptionService } from '../services/subscription.service'
import { WorkspaceService } from '../services/workspace.service'

declare module 'typerestjs' {
	interface ServerRequest {
		subscription?: SubscriptionModel.full
		block: BMSBlockModel.block
	}
}

export namespace SubscriptionMiddleware {
	// type BlockPropertiesOptions = {
	// 	[key in SubscriptionModel.type]?: {
	// 		data?: (val: BlockModel.data) => boolean
	// 		metadata?: (val: BlockModel.metadata) => boolean
	// 		preferences?: (val: any) => boolean
	// 		colors?: (val: any) => boolean
	// 	}
	// }

	export const limitCollaborators = (opts: { workspaceFrom: 'params' | 'query' | 'body' | 'block' }): Middleware => {
		return async (req, reply) => {
			if (NEnv.STAGE === 'development') return

			const workspaceId = req[opts.workspaceFrom].workspaceId

			const subscription = await SubscriptionService.getSubscription(workspaceId)
			const count = (await WorkspaceService.countCollaborators(workspaceId)) - 1

			const maxCount = await SubscriptionService.getFeature<number>('collaborators', subscription?.type ?? 'free')
			if (count >= maxCount) {
				return reply.error(
					402,
					'subscription_limit',
					`You need to upgrade your subscription to invite ${
						count === 0 ? 'collaborators' : `more than ${count} collaborators`
					}`
				)
			}

			req.subscription = subscription
		}
	}

	export const limitProjectCreation = (opts: {
		workspaceFrom: 'params' | 'query' | 'body' | 'block'
	}): Middleware<any> => {
		return async (req, reply) => {
			if (NEnv.STAGE === 'development') return

			const workspaceId = req[opts.workspaceFrom].workspaceId

			const subscription = await SubscriptionService.getSubscription(workspaceId)
			const count = await MongoDB.blocks.countDocuments({ workspaceId: workspaceId, isRoot: true })

			const maxCount = await SubscriptionService.getFeature<number>('projects', subscription?.type ?? 'free')
			if (count >= maxCount) {
				return reply.error(
					402,
					'subscription_limit',
					`You need to upgrade your subscription to create more than ${count} projects`
				)
			}

			req.subscription = subscription
		}
	}

	export const limitAIAssistant = (opts: { workspaceFrom: 'params' | 'query' | 'body' | 'block' }): Middleware<any> => {
		return async (req, reply) => {
			if (NEnv.STAGE === 'development') return

			const workspaceId = req[opts.workspaceFrom].workspaceId

			const subscription = await SubscriptionService.getSubscription(workspaceId)
			const authorized = await SubscriptionService.getFeature<boolean>('ai_assistant', subscription?.type ?? 'free')

			if (!authorized) {
				return reply.error(402, 'subscription_limit', `You need to upgrade your subscription to use our AI assistant`)
			}

			req.subscription = subscription
		}
	}

	// const isBlockProperties = (prop: string): prop is 'preferences' | 'colors' | 'data' | 'metadata' => {
	// 	return ['preferences', 'colors'].includes(prop)
	// }

	// export const paidFeature = (): Middleware<any> => {
	// 	return async (req, reply) => {
	// 		const workspaceId = req.body.workspaceId ?? req.block.workspaceId

	// 		if (NEnv.STAGE === 'development' || Consts.WORKSPACE_WHITELIST.includes(workspaceId)) return

	// 		const subscription = await getSubscription(workspaceId)

	// 		if (!subscription || subscription.type === 'free') {
	// 			return reply.error(402, 'subscription_limit', 'You need to upgrade your subscription to use this feature')
	// 		}

	// 		return
	// 	}
	// }

	// export const limitBlockProperties = (options: BlockPropertiesOptions): Middleware<any> => {
	// 	return async (req, reply) => {
	// 		const workspaceId = req.block.workspaceId

	// 		if (NEnv.STAGE === 'development' || Consts.WORKSPACE_WHITELIST.includes(workspaceId)) return

	// 		const subscription = await getSubscription(workspaceId)

	// 		const limits = options[subscription?.type ?? 'free']
	// 		if (limits == null) return

	// 		for (let prop in req.body) {
	// 			if (!isBlockProperties(prop)) continue

	// 			const prediction = limits[prop]
	// 			if (prediction == null) continue

	// 			if (prediction(req.body[prop]) === true) {
	// 				return reply.error(402, 'subscription_limit', `You need to upgrade your subscription to use this features`)
	// 			}
	// 		}

	// 		return
	// 	}
	// }
}

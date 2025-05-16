import { Route } from 'typerestjs'
import { BlockController } from '../controllers/block.controller'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { SubscriptionMiddleware } from '../middlewares/subscription.middleware'
import { BlockSchema } from '../schemas/block.schema'

export namespace BlockRoute {
	export const PREFIX = '/blocks'

	export const createOne: Route<BlockSchema.createOne> = {
		method: 'POST',
		path: '/',
		middlewares: [
			(req, reply) => {
				if (req.body.isRoot) return AuthMiddleware.fromWorkspace({ role: 'editor' })(req, reply)
				else return AuthMiddleware.fromBlock({ field: 'parentId', role: 'editor' })(req, reply)
			},
			(req, reply) => {
				if (req.body.isRoot) return SubscriptionMiddleware.limitProjectCreation({ workspaceFrom: 'body' })(req, reply)
				else return new Promise((resolve) => resolve(undefined))
			},
		],
		schema: BlockSchema.createOne,
		handler: BlockController.createOne,
	}

	export const getMultiple: Route<BlockSchema.getMultiple> = {
		method: 'GET',
		path: '/',
		middlewares: [AuthMiddleware.fromWorkspace({ role: 'viewer' })],
		schema: BlockSchema.getMultiple,
		handler: BlockController.getMultiple,
	}

	export const getOne: Route<BlockSchema.getOne> = {
		method: 'GET',
		path: '/:blockId',
		middlewares: [AuthMiddleware.fromBlock({ role: 'viewer' })],
		schema: BlockSchema.getOne,
		handler: BlockController.getOne,
	}

	export const getGraph: Route<BlockSchema.getGraph> = {
		method: 'GET',
		path: '/:blockId/graph',
		middlewares: [AuthMiddleware.fromBlock({ role: 'viewer' })],
		schema: BlockSchema.getGraph,
		handler: BlockController.getGraph,
	}

	export const getBlocks: Route<BlockSchema.getBlocks> = {
		method: 'GET',
		path: '/:blockId/blocks',
		middlewares: [AuthMiddleware.fromBlock({ role: 'viewer' })],
		schema: BlockSchema.getBlocks,
		handler: BlockController.getBlocks,
	}

	export const updateOne: Route<BlockSchema.updateOne> = {
		method: 'PATCH',
		path: '/:blockId',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: BlockSchema.updateOne,
		handler: BlockController.updateOne,
	}

	export const reorder: Route<BlockSchema.reorder> = {
		method: 'POST',
		path: '/:blockId/reorder',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: BlockSchema.reorder,
		handler: BlockController.reorder,
	}

	export const duplicate: Route<BlockSchema.duplicate> = {
		method: 'POST',
		path: '/:blockId/duplicate',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: BlockSchema.duplicate,
		handler: BlockController.duplicate,
	}

	export const publish: Route<BlockSchema.publish> = {
		method: 'POST',
		path: '/:blockId/publish',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: BlockSchema.publish,
		handler: BlockController.publish,
	}

	export const unpublish: Route<BlockSchema.unpublish> = {
		method: 'POST',
		path: '/:blockId/unpublish',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: BlockSchema.unpublish,
		handler: BlockController.unpublish,
	}

	export const deleteOne: Route<BlockSchema.deleteOne> = {
		method: 'DELETE',
		path: '/:blockId',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: BlockSchema.deleteOne,
		handler: BlockController.deleteOne,
	}
}

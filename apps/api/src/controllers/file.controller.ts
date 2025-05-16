import { Handler } from 'typerestjs'
import { FileSchema } from '../schemas/file.schema'
import { FileService } from '../services/file.service'

export namespace FileController {
	export const addOne: Handler<FileSchema.addOne> = async (req, reply) => {
		const file = await FileService.upload(req.body.file, {
			userId: req.user.id,
			workspaceId: req.body.workspaceId,
			aspectRatio: FileService.parseAspectRatio(req.body.aspectRatio),
			source: req.body.source,
		})

		return reply.success(201, file)
	}

	export const getOne: Handler<FileSchema.getOne> = async (req, reply) => {
		const file = await FileService.getOne(req.params.url)

		if (!file) return reply.error(404, 'file_not_found')

		return reply.success(200, file)
	}

	export const getAll: Handler<FileSchema.getAll> = async (req, reply) => {
		const files = await FileService.getMultiple(req.query.workspaceId, {
			type: req.query.type,
			source: req.query.source,
		})

		return reply.success(200, files)
	}

	export const storage: Handler<FileSchema.storage> = async (req, reply) => {
		const storageUsed = await FileService.getUsedStorage(req.query.workspaceId)
		return reply.success(200, storageUsed)
	}

	export const updateOne: Handler<FileSchema.updateOne> = async (req, reply) => {
		const file = await FileService.updateOne(req.params.url, req.body)

		if (!file) return reply.error(404, 'file_not_found')

		return reply.success(200, file)
	}
}

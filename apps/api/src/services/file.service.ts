import { FileModel } from '@notice-app/models'
import { MongoDB } from '@notice-app/mongodb'
import { Postgres } from '@notice-app/postgres'
import { NUrls } from '@notice-app/tools'
import axios from 'axios'
import { randomUUID } from 'crypto'
import { ReadStream, createReadStream } from 'fs'
import { extension } from 'mime-types'
import { Is, ModelType } from 'typerestjs'

export namespace FileService {
	const saveOrUpload = async (path: string, filename: string, stream: ReadStream) => {
		await axios.put(`${process.env.BUNNY_FILES_STORAGE_URL}/${path}/${filename}`, stream, {
			headers: {
				'Content-Type': 'application/octet-stream',
				AccessKey: process.env.BUNNY_FILES_STORAGE_KEY,
			},
		})

		return `${NUrls.App.files()}/${path}/${filename}`
	}

	export const upload = async (
		file: ModelType<ReturnType<typeof Is.file>> | string,
		options: {
			userId: string
			workspaceId?: string
			mimetype?: string
			aspectRatio?: number
			source?: FileModel.source
			description?: string
			originalName?: string
		}
	): Promise<FileModel.client> => {
		let path = 'global'
		if (options.workspaceId != null) path = `workspaces/${options.workspaceId}`
		else path = `users/${options.userId}`

		const isURL = typeof file === 'string'

		let stream: ReadStream
		if (isURL) {
			const { data } = await axios.get(file, { responseType: 'stream' })
			stream = data
		} else {
			stream = createReadStream(file.path)
		}

		const url = await saveOrUpload(
			path,
			`${randomUUID()}.${extension(isURL ? options.mimetype ?? 'image/png' : file.mimetype)}`,
			stream
		)

		const data = {
			id: Postgres.uuid(),
			url: url,
			size: isURL ? null : file.size,
			// ternary in ternary, I shall go to Hell I know
			originalName: options.originalName ? options.originalName : isURL ? 'File' : file.filename,
			mimetype: isURL ? options.mimetype ?? 'image/png' : file.mimetype,
			userId: options.userId,
			workspaceId: options.workspaceId,
			aspectRatio: options?.aspectRatio ?? null,
			source: options?.source ?? 'editor',
			description: options.description ?? '',
		}

		await Postgres.files().insert(data)

		return data
	}

	export const getOne = async (url: string) => {
		const file = await Postgres.files().where('url', url).first()

		return file
	}

	export const getMultiple = async (workspaceId: string, options?: { type?: string; source?: FileModel.source }) => {
		const files = await Postgres.files()
			.where('workspaceId', workspaceId)
			.andWhere((builder) => {
				if (options?.type != null) {
					builder.whereILike('mimetype', `${options.type}/%`)
				}
				if (options?.source != null) {
					builder.where('source', options.source)
				}

				return builder
			})
			.orderBy('createdAt', 'desc')
			.limit(100)

		return files
	}

	export const getUsedStorage = async (workspaceId: string) => {
		const files = await Postgres.files().select('size').where('workspaceId', '=', workspaceId).whereNotNull('size')
		const bytesUsed = files.reduce((acc, cur) => acc + (cur.size ?? 0), 0)

		return bytesUsed / 1_000_000_000
	}

	export const parseAspectRatio = (aspectRatio?: string | number | null) => {
		if (typeof aspectRatio === 'number') return aspectRatio

		const value = parseFloat(aspectRatio ?? '1')
		if (isNaN(value)) return 1

		return value
	}

	export const updateOne = async (url: string, { ...data }: Partial<FileModel.client>) => {
		const file = await Postgres.files().where('url', url).first()

		if (!file) return null

		// On MongoDB, update originalName and description if they are not null where type === 'image' and 'url' === url

		const res = await MongoDB.blocks.updateMany({ 'data.file.url': url }, [{ $set: { 'data.file': { ...data } } }])

		await Postgres.files().where('url', url).update(data)

		return {
			...file,
			...data,
		}
	}
}

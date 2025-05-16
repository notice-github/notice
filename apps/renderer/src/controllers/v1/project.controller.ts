import { V1ProjectSchema } from '@root/schemas/v1/project.schema'
import { BlockService } from '@root/services/block.service'
import { ContextService } from '@root/services/context.service'
import { Handler } from 'typerestjs'

export namespace V1ProjectController {
	/**
	 * @GET /v1/projects/:projectId
	 */
	export const get: Handler<V1ProjectSchema.get> = async (req, reply) => {
		const project = await BlockService.getOne(req.params.projectId)
		if (!project) return reply.error(404, 'project_not_found')
		if (!project.isRoot) return reply.error(400, 'not_a_project')

		reply.custom().header('CDN-Tag', project._id)

		return reply.success(200, BlockService.exportBlock(project))
	}

	/**
	 * @GET /v1/projects/:projectId/pages
	 */
	export const pages: Handler<V1ProjectSchema.pages> = async (req, reply) => {
		const base = await BlockService.getBlockBase(req.params.projectId)
		if (!base) return reply.error(404, 'project_not_found')
		if (base._id !== base.rootId) return reply.error(400, 'not_a_project')

		const lang = ContextService.language(req, base.defaultLanguage, base.availableLanguages)

		const pages = await BlockService.getPages(base, lang)

		reply.custom().header('CDN-Tag', base.rootId)

		return reply.success(
			200,
			pages.map((page) => BlockService.exportBlock(page))
		)
	}

	/**
	 * @GET /v1/projects/:projectId/blocks-tree
	 */
	export const blocksTree: Handler<V1ProjectSchema.blocksTree> = async (req, reply) => {
		const base = await BlockService.getBlockBase(req.params.projectId)
		if (!base) return reply.error(404, 'project_not_found')
		if (base._id !== base.rootId) return reply.error(400, 'not_a_project')

		const lang = ContextService.language(req, base.defaultLanguage, base.availableLanguages)

		const tree = await BlockService.getTree(base, lang)

		reply.custom().header('CDN-Tag', base.rootId)

		return reply.success(200, BlockService.exportGraph(tree))
	}

	/**
	 * @GET /v1/projects/:projectId/pages-tree
	 */
	export const pagesTree: Handler<V1ProjectSchema.pagesTree> = async (req, reply) => {
		const base = await BlockService.getBlockBase(req.params.projectId)
		if (!base) return reply.error(404, 'project_not_found')
		if (base._id !== base.rootId) return reply.error(400, 'not_a_project')

		const lang = ContextService.language(req, base.defaultLanguage, base.availableLanguages)

		const tree = await BlockService.getPageTree(base, lang)

		reply.custom().header('CDN-Tag', base.rootId)

		return reply.success(200, BlockService.exportGraph(tree))
	}
}

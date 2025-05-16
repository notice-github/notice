import { BlockModel } from '@notice-app/models'
import { randomUUID } from 'crypto'
import { Parser as HTMLParser } from 'htmlparser2'
import { marked } from 'marked'
import { Handler } from 'typerestjs'
import { ImportSchema } from '../schemas/import.schema'
import { BlockService } from '../services/block.service'

export namespace ImportController {
	export const markdown: Handler<ImportSchema.markdown> = async (req, reply) => {
		if (req.block.type !== 'page') return reply.error(404, 'page_not_found')

		const html = marked.parse(req.body.markdown, { mangle: false, headerIds: false })
		const blocks = await parseHTMLToBlocks(html, req.block.rootId)

		const { _id, blockIds, createdAt, updatedAt, workspaceId, deletedAt, isRoot, isTemplate, ...parent } = req.block

		await BlockService.saveGraph({
			id: _id,
			...parent,
			blocks,
		})

		return reply.success(200, blocks)
	}

	export const bms: Handler<ImportSchema.bms> = async (req, reply) => {
		if (req.block.type !== 'page') return reply.error(404, 'page_not_found')

		const { _id, blockIds, createdAt, updatedAt, preferences, workspaceId, deletedAt, isRoot, isTemplate, ...parent } =
			req.block

		const bms = req.body.bms

		await BlockService.saveGraph({
			...parent,
			...bms,
			id: _id,
		})

		return reply.success(200, 'success')
	}
}

export const parseHTMLToBlocks = (html: string, rootId: string, skipList: Array<string> = []) => {
	return new Promise<BlockModel.graph[]>((resolve) => {
		const blocks: BlockModel.graph[] = []

		const queue: BlockModel.graph[] = []
		const currentBlock = () => queue.at(-1)!
		const hasParent = () => queue.length > 0

		const addParagraph = () => {
			;(currentBlock()?.blocks ?? blocks).push({
				id: randomUUID(),
				type: 'paragraph',
				data: { leaves: [{ text: '' }] },
				metadata: {},
				rootId: rootId,
				blocks: [],
			})
		}

		const parser = new HTMLParser({
			onopentag(name, attrs) {
				let block: Omit<BlockModel.graph, 'id' | 'metadata' | 'blocks' | 'rootId'> | undefined
				if (skipList.includes(name)) return
				switch (name) {
					case 'h1':
					case 'h2':
					case 'h3': {
						addParagraph()

						block = {
							type: name === 'h1' ? 'header-1' : name === 'h2' ? 'header-2' : 'header-3',
							data: {
								leaves: [{ text: '' }],
							},
						}
						break
					}
					case 'ol': {
						block = {
							type: 'numbered-list',
							data: {},
						}
						break
					}
					case 'ul': {
						block = {
							type: 'bulleted-list',
							data: {},
						}
						break
					}
					case 'li': {
						block = {
							type: 'list-item',
							data: {
								leaves: [{ text: '' }],
							},
						}
						break
					}
					case 'details': {
						block = {
							type: 'expandable',
							data: {
								variant: 'bottom-bordered',
							},
						}
						break
					}
					case 'summary': {
						if (hasParent() && currentBlock().type === 'expandable') {
							currentBlock().data.title = ''
						}
						break
					}
					case 'p': {
						block = {
							type: 'paragraph',
							data: {
								leaves: [{ text: '' }],
							},
						}
						break
					}
					case 'pre': {
						block = {
							type: 'code',
							data: {
								code: '',
								theme: 'one_dark',
							},
						}
						break
					}
				}

				if (block) {
					const newBlock = {
						id: randomUUID(),
						...block,
						metadata: {},
						rootId: rootId,
						blocks: [],
					}

					if (hasParent()) {
						const parent = currentBlock()
						if (
							(newBlock.type === 'bulleted-list' || newBlock.type === 'numbered-list') &&
							parent.type === 'list-item'
						) {
							queue.at(-2)?.blocks.push(newBlock)
						} else {
							parent.blocks.push(newBlock)
							if (newBlock.type === 'paragraph') addParagraph()
						}
					}
					queue.push(newBlock)
				}
			},

			onclosetag(name) {
				if (!['h1', 'h2', 'h3', 'ul', 'ol', 'li', 'details', 'paragraph', 'p', 'pre'].includes(name)) return

				const block = queue.pop()
				if (block != null && !hasParent()) blocks.push(block)
			},

			ontext(text) {
				if (!hasParent()) return

				const block = currentBlock()

				switch (block.type) {
					case 'header-1':
					case 'header-2':
					case 'header-3':
					case 'list-item':
					case 'paragraph': {
						block.data.leaves[0].text += text.replace(/\n/g, '')
						break
					}
					case 'expandable': {
						if (block.data.title != null) block.data.title += text.replace(/\n/g, '')
						break
					}
					case 'code': {
						block.data.code += text
						break
					}
				}
			},

			onend() {
				resolve(blocks)
			},
		})

		parser.write(html)

		parser.end()
	})
}

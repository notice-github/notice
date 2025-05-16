import { BlockModel } from '@notice-app/models'
import _ from 'lodash'
import { lookup } from 'mime-types'

// Transform Slate format into BMS format
export namespace SerializerService {
	export const slate = (blockIn: any, depth = 0) => {
		if (!blockIn) return null

		let blockOut: BlockModel.graph = {
			id: blockIn.id,
			type: blockIn.type,
			data: {},
			metadata: {},
			blocks: [],
			rootId: blockIn.rootId,
		}

		switch (blockIn.type) {
			//
			// Only Leaves
			//
			case 'paragraph':
			case 'quote':
			case 'list-item':
				blockOut.data = { leaves: blockIn.children ?? [] }
				break

			//
			// Leaves + Data
			//
			case 'hint':
				blockOut.data = { leaves: blockIn.children ?? [], type: blockIn.subtype }
				break
			case 'check-list-item':
				blockOut.data = { leaves: blockIn.children ?? [], checked: blockIn.checked }
				blockOut.type = 'checkbox'
				break

			case 'header-1':
			case 'header-2':
			case 'header-3':
				blockOut.data = { leaves: blockIn.children ?? [], isSection: blockIn.isSection }
				break
			//
			// Only Data
			//
			case 'javascript':
			case 'html':
				blockOut.data = { code: blockIn.codeText }
				break
			case 'code':
				blockOut.data = {
					code: blockIn.codeText,
					language: blockIn.language,
					theme: blockIn.codeTheme,
				}
				break
			case 'image':
				blockOut.data = {
					file: {
						url: blockIn.url,
						mimetype: blockIn.mimetype,
						size: blockIn.size,
						originalName: blockIn.originalName,
						aspectRatio: blockIn.aspectRatio,
						description: blockIn.description,
					},
					width: blockIn.width,
					alignment: blockIn.alignment,
				}
				break
			case 'document':
				blockOut.data = {
					file: {
						url: blockIn.url,
						size: blockIn.size,
						originalName: blockIn.originalName,
						mimetype: lookup(blockIn.extension),
					},
				}
				break
			case 'video':
				blockOut.data = {
					file: {
						url: blockIn.url,
						mimetype: lookup(blockIn.extension),
					},
				}
				break
			case 'audio':
				blockOut.data = {
					file: {
						url: blockIn.url,
						mimetype: lookup(blockIn.extension),
					},
				}
				break

			case 'embed':
				blockOut.data = {
					service: blockIn.service,
					source: blockIn.source,
					url: blockIn.url,
				}
				break
			case 'table':
				blockOut.data = { content: blockIn.content }
				break

			//
			// Only Blocks
			//
			case 'bulleted-list':
			case 'numbered-list':
				blockOut.blocks = blockIn.children
					.map((child: any) => slate(child, depth + 1))
					.filter((child: any) => child != null)
				break

			//
			// Blocks + Data
			//
			case 'expandable':
				blockOut.data = { title: blockIn.title, variant: blockIn.variant }
				blockOut.blocks = blockIn.children
					.map((child: any) => slate(child, depth + 1))
					.filter((child: any) => child != null)
				break

			//
			// Special
			//
			case 'divider':
				break
			case 'page':
				if (depth === 0) {
					blockOut.blocks = blockIn.children
						.map((child: any) => slate(child, depth + 1))
						.filter((child: any) => child != null)
					if (blockIn.text) {
						blockOut.data.text = blockIn.text ?? ''
					}
				} else {
					blockOut.data = {
						text: (blockIn.children ?? []).reduce((prev: string, curr: any) => prev + curr.text, ''),
						cover: blockIn.cover,
						displayCover: blockIn.displayCover,
						displaySummary: blockIn.displaySummary,
						displayBorder: blockIn.displayBorder,
					}
				}
				break

			// All others will be ignored
			default:
				return null
		}

		return _.cloneDeep(blockOut)
	}
}

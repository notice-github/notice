import { BlockModel } from '@notice-app/models'
import _ from 'lodash'
import { extension } from 'mime-types'
import { MetadataService } from './metadata.service'

// Transform BMS format into another format (Slate, simplified JSON, etc.)
export namespace DeserializerService {
	export const slate = (blockIn: BlockModel.graph, depth = 0): any => {
		let blockOut: any = {
			id: blockIn.id,
			type: blockIn.type,
			children: [{ text: '' }],
		}

		blockOut.metadata = blockIn?.metadata ?? {}
		switch (blockIn.type) {
			//
			// Only Leaves
			//
			case 'paragraph':
			case 'quote':
			case 'list-item':
				blockOut.children = blockIn.data.leaves ?? []
				break

			//
			// Leaves + Data
			//
			case 'hint':
				blockOut.children = blockIn.data.leaves ?? []
				blockOut.subtype = blockIn.data.type ?? 'INFO'
				break
			case 'checkbox':
				blockOut.children = blockIn.data.leaves ?? []
				blockOut.type = 'check-list-item'
				blockOut.checked = blockIn.data.checked ?? false
				break

			case 'header-1':
			case 'header-2':
			case 'header-3':
				blockOut.children = blockIn.data.leaves ?? []
				blockOut.isSection = blockIn.data.isSection
				break

			//
			// Only Data
			//
			case 'table':
				blockOut.content = blockIn.data.content
				break
			case 'javascript':
			case 'html':
				blockOut.codeText = blockIn.data.code
				break
			case 'code':
				blockOut.codeText = blockIn.data.code
				blockOut.language = blockIn.data.language
				blockOut.codeTheme = blockIn.data.theme
				break
			case 'image':
				blockOut.url = blockIn.data.file.url
				blockOut.mimetype = blockIn.data.file.mimetype
				blockOut.size = blockIn.data.file.size
				blockOut.originalName = blockIn.data.file.originalName
				blockOut.aspectRatio = blockIn.data.file.aspectRatio
				blockOut.width = blockIn.data.width
				blockOut.alignment = blockIn.data.alignment
				blockOut.description = blockIn.data.file.description
				break
			case 'video':
				blockOut.url = blockIn.data.file.url
				blockOut.extension = extension(blockIn.data.file.mimetype)
				break
			case 'audio':
				blockOut.url = blockIn.data.file.url
				blockOut.extension = extension(blockIn.data.file.mimetype)
				break
			case 'document':
				blockOut.url = blockIn.data.file.url
				blockOut.size = blockIn.data.file.size
				blockOut.originalName = blockIn.data.file.originalName
				blockOut.extension = extension(blockIn.data.file.mimetype)
				break

			case 'embed':
				blockOut.service = blockIn.data.service
				blockOut.source = blockIn.data.source
				blockOut.url = blockIn.data.url
				break

			//
			// Only Blocks
			//
			case 'bulleted-list':
			case 'numbered-list':
				blockOut.children = blockIn.blocks.map((block) => slate(block, depth + 1)).filter((block) => block != null)
				break

			//
			// Blocks + Data
			//
			case 'expandable':
				blockOut.title = blockIn.data.title
				blockOut.variant = blockIn.data.variant
				blockOut.children = blockIn.blocks.map((block) => slate(block, depth + 1)).filter((block) => block != null)
				break

			//
			// Special
			//
			case 'divider':
				break
			case 'page':
				if (depth === 0) {
					blockOut.children = blockIn.blocks.map((block) => slate(block, depth + 1)).filter((block) => block != null)
					blockOut.text = blockIn.data.text ?? ''
				} else {
					blockOut.children = [{ text: blockIn.data.text ?? '' }]

					blockOut.displayCover = blockIn.data.displayCover
					blockOut.cover = blockIn.data.cover

					const texts = blockIn.blocks.filter((b) => ['header-1', 'header-2', 'header-3', 'paragraph'].includes(b.type))

					blockOut.displaySummary = blockIn.data.displaySummary
					blockOut.displayBorder = blockIn.data.displayBorder
					blockOut.summary = blockOut?.metadata?.summary ?? MetadataService.createSummary(texts)
				}
				break

			// All others will be ignored
			default:
				return null
		}

		if (
			depth > 0 &&
			(blockOut.children == null ||
				!Array.isArray(blockOut.children) ||
				blockOut.children.length === 0 ||
				Object.values(blockOut.children[0]).filter((child) => child !== undefined).length === 0)
		) {
			blockOut.children = [{ text: '' }]
		}

		return _.cloneDeep(blockOut)
	}
}

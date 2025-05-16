import { BlockModel } from '@notice-app/models'
import { NStrings } from '@notice-app/tools'
import seedrandom from 'seedrandom'
import { Consts } from '../tools/consts'

export namespace MetadataService {
	export const generatePageSlug = (blockId: string, text: string | undefined | null) => {
		if (!text) return

		const rng = seedrandom(blockId)

		let title = NStrings.slugify(text)
		if (!title) return

		if (title.length > 127) title = title.substring(0, 128)

		const slugId = Array.from({ length: Consts.SLUG_SIZE })
			.map(() => Consts.SLUG_ALPHABET[Math.floor(Consts.SLUG_ALPHABET.length * rng())] ?? '')
			.join('')

		return title + '-' + slugId
	}

	export const generateRootDomain = (blockId: string, text: string | undefined | null) => {
		if (!text) return

		const rng = seedrandom(blockId)

		let title = NStrings.slugify(text)
		if (!title) return

		if (title.length > 127) title = title.substring(0, 128)

		const slugId = Array.from({ length: Consts.SLUG_SIZE / 2 })
			.map(() => Consts.SLUG_ALPHABET[Math.floor(Consts.SLUG_ALPHABET.length * rng())] ?? '')
			.join('')

		return title + '-' + slugId
	}

	export const generateTimeToRead = (page: BlockModel.graph | BlockModel.graph) => {
		const wpm = 256 // words per minute
		let ttr = 0

		for (let block of page.blocks) {
			switch (block.type) {
				case 'image':
				case 'video':
					ttr += 10
					break
				case 'embed':
					ttr += 25
					break
				case 'table':
					ttr += 15
					break
				case 'code':
					ttr += 30
					break
				default: {
					if (block.data.leaves) {
						const text = (block.data.leaves as { text: string }[]).reduce((text, leaf) => text + leaf.text, '')
						const words = text.trim().split(/\s+/).length
						ttr += (words / wpm) * 60
					}
				}
			}
		}

		return ttr < 60 ? 60 : Math.ceil(ttr)
	}

	export const createSummary = (texts: any[]) => {
		let summary = ''

		for (let text of texts) {
			const leaves: { text: string }[] = text.data?.leaves ?? text.children
			const words = leaves
				.reduce((acc, leaf) => acc + leaf.text, '')
				.split(/\s+/)
				.filter((word) => word !== '')

			for (let word of words) {
				if (summary.length + word.length > 197) {
					return summary + '...'
				} else {
					summary += (summary.length > 0 ? ' ' : '') + word
				}
			}
		}

		return summary
	}
}

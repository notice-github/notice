import { BMSBlockModel } from '@notice-app/models'
import slugify from 'slugify'

export namespace Helpers {
	export const leavesToText = (leaves: any[]) => {
		return leaves.reduce((acc, curr) => acc + curr.text, '')
	}

	export const slugOf = (input: string) => {
		return slugify(input, {
			replacement: '-', // replace spaces with replacement character, defaults to `-`
			remove: undefined, // remove characters that match regex, defaults to `undefined`
			lower: true, // convert to lower case, defaults to `false`
			strict: true, // strip special characters except replacement, defaults to `false`
			locale: 'en', // language code of the locale to use
			trim: true, // trim leading and trailing replacement chars, defaults to `true`
		})
	}

	export const isMyChild = (parent: BMSBlockModel.graph, childId: string) => {
		for (let child of parent.blocks) {
			if (child._id === childId) return true

			if (child.blocks.length > 0) {
				const founded = isMyChild(child, childId)
				if (founded) return true
			}
		}

		return false
	}

	export const sizeConverter = (bytes?: number) => {
		if (!bytes) return null

		const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

		let i = 0

		for (i; bytes > 1024; i++) {
			bytes /= 1024
		}

		return bytes.toFixed(1) + ' ' + units[i]
	}

	export const hasImage = (parent: BMSBlockModel.graph) => {
		return parent.blocks.some((block) => {
			if (block.type === 'expandable') {
				return hasImage(block)
			}

			return block.type === 'image'
		})
	}

	export const getUrl = (navigationType: string, slugOrId: string) => {
		switch (navigationType) {
			case 'slash':
				return `/${slugOrId}`
			case 'query':
				return `?page=${slugOrId}`
			case 'memory':
				return ''
			default:
				// important to keep retro compatibility
				return `?page=${slugOrId}`
		}
	}
}

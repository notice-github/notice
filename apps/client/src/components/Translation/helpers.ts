import { BlockModel, PageModel } from '@notice-app/models'
import { StatusMapType } from './TranslateLanguageBlock'

export const exclusionList = ['page', 'image', 'video', 'audio', 'bulleted-list', 'numbered-list', 'document']

// remove the color on the border (not the border size to avoid layout shits)
export function unlightBlock(elementId: string) {
	const element = document.getElementById(elementId)
	if (element?.style) {
		element.classList.remove('translate-highlighted')
	}
}

// highlight and scrollIntoView the block
export function highlightBlock(elementId: string, theme: any, excludeContainer: any) {
	const element = document.getElementById(elementId)

	// we don't want to highlight the block if it's inside the translate to wrapper
	// if the translate wrapper is not defined, let's skip the check
	if (element?.style && (!excludeContainer.current || !excludeContainer.current.contains(element))) {
		element.classList.add('translate-highlighted')

		element.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}
}

export function findBlock(blocks: BlockModel.graph[] | null, index: number) {
	if (!blocks) return
	return blocks[index]
}

export function findNonEmptyBlockIndex(allBlocksArray: any | null, index: number, order = 'next') {
	let blockIndex = order === 'next' ? index + 1 : index - 1
	return allBlocksArray[blockIndex]
}

// check if the block has empty content (to be improved)
export function isBlockEmpty(block: any) {
	if (!block) return true
	if (block.type === 'table') return false
	const { children } = block

	const value = children.reduce((acc: any, child: any) => {
		acc += child.text
		return acc
	}, '')
	return value ? false : true
}

// update the className of the block (circle on the left side)
export function updateHTMLStatusClasses({ anchor, newMap }: { anchor: Element; newMap: any }) {
	const classMap: { [key: string]: string[] } = {
		translated: ['translation-translated'],
		outOfDate: ['translation-out-of-date'],
		notTranslated: ['translation-not-translated'],
	}

	const classes = classMap[newMap[anchor.id] as keyof StatusMapType] || []

	anchor.classList.remove(
		'translation-translated',
		'translation-out-of-date',
		'translation-not-translated',
		'empty-block-status',
		'not-empty-block-status'
	)
	anchor.classList.add(...classes, classes?.length ? 'not-empty-block-status' : 'empty-block-status')
}

export function triggerEditorFocus(blockId: string) {
	const elem = document.getElementById(`${blockId}-edit`)
	// The click event in the editOnly blocks is set to focus (see renderElements.tsx)
	if (elem) {
		elem.click()
		elem.classList.add('focused')
	}
}

export function flatPagesFromGraphRecursive(graph: PageModel.graph, pageIds: string[] = []) {
	graph.subpages?.forEach((page) => {
		pageIds.push(page.id)
		if (page.subpages) flatPagesFromGraphRecursive(page, pageIds)
	})

	return graph
}

export function flatBlocksFromGraphRecursive(
	blocks: Array<BlockModel.block>,
	flattenedBlocks: Array<BlockModel.block> = []
) {
	if (!blocks) return
	blocks.forEach((block) => {
		if (block.type && !exclusionList.includes(block.type)) {
			flattenedBlocks.push(block)
		}
		if (block?.children) flatBlocksFromGraphRecursive(block.children, flattenedBlocks)
	})
}

export function getFlatBlocks(blocks: Array<BlockModel.block>) {
	let flattenedBlocks: Array<BlockModel.block> = []

	flatBlocksFromGraphRecursive(blocks, flattenedBlocks)
	return flattenedBlocks
}

export function getFlatBlocksMap(parentBlock: any, allBlocksMap?: any): [Array<BlockModel.block>, any] {
	let flatBlocks = parentBlock?.children ? getFlatBlocks(parentBlock.children) : []

	parentBlock && flatBlocks.unshift(parentBlock)

	flatBlocks = flatBlocks.filter((b, index) => {
		const defaultBlock = allBlocksMap && allBlocksMap[b.id]

		if (index === 0) return true
		if (!b) return false

		if (b.type === 'table') return true

		// TODO: we are checking for empty lang blocks here, but we shall check for empty default blocks
		if (allBlocksMap && isBlockEmpty(defaultBlock) && b.type !== 'page') return false

		// excludes index 0 because it's the block title
		if (exclusionList.includes(b.type)) return false
		return true
	})

	const flatBlocksMap = {}

	flatBlocks.forEach((block, index) => {
		const newBlock = { ...block }

		newBlock.index = index
		flatBlocksMap[block.id] = newBlock
	})

	return [flatBlocks, flatBlocksMap]
}

export function getFlatPages(graph: PageModel.graph) {
	let pageIds = [graph.id]
	flatPagesFromGraphRecursive(graph, pageIds)
	return pageIds
}

export function getNextPrevPage(graph: PageModel.graph | null, order = 'next', currentPageId: string) {
	if (!graph) return null
	let newPageId = ''
	const pageIds = getFlatPages(graph)

	const currentIndex = pageIds.indexOf(currentPageId)
	if (order === 'next') newPageId = pageIds[currentIndex + 1]
	else newPageId = pageIds[currentIndex - 1]
	return newPageId
}

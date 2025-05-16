import { Editor, Transforms } from 'slate'
import { jsx } from 'slate-hyperscript'
import { CustomElement, CustomText } from '../types'
import { LANGUAGES } from '../Blocks/Code/data'

type CustomNode = CustomText | CustomElement

const TEXT_NODES = ['#text', 'A', 'STRONG', 'B', 'DEL', 'S', 'EM', 'I', 'U', 'SPAN', 'CODE']
const ELEMENT_NODES = ['SPAN', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI']

export const childrenOf = (node: Node, allowed?: string[]): CustomNode[] => {
	let children = [...node.childNodes]

	if (allowed) {
		if (allowed.length === 1 && allowed[0] === '#text') allowed = TEXT_NODES
		children = children.filter((node) => allowed!.includes(node.nodeName))
	}

	return children
		.map((child) => parseNode(child, node))
		.reduce<CustomNode[]>((acc, curr) => (curr ? [...acc, ...curr] : acc), [])
}

export const parseNode = (node: Node, parent?: Node): CustomNode[] | null => {
	const text = node.textContent?.replace(/\n/g, '') ?? ''

	if (process.env.NODE_ENV === 'development') console.log(node.nodeName, node)

	switch (node.nodeName) {
		// SKIPED NODES
		case 'BODY':
		case 'DIV':
		case 'MAIN':
		case 'SECTION':
		case 'ARTICLE':
			return childrenOf(node)

		// DEFAULT TO TEXT NODE
		default: {
			if (text.length > 0) return [jsx('text', undefined, text)]
			else return null
		}

		// IGNORED NODES
		case '#comment':
			return null

		//  PUT THE PRE before because it returns a #text node
		case 'PRE': {
			const pre = node as HTMLPreElement
			const lang = [...pre.classList].find((c) => /^(lang|language)-.+/.test(c))?.split('-')?.[1] ?? 'plain_text'

			const language = LANGUAGES.find((l) => lang === l.value || lang === l.code)?.value ?? 'plain_text'
			return [jsx('element', { type: 'code', codeText: pre.innerText, language, codeTheme: 'one_dark' })]
		}

		// TEXT NODES
		case '#text':
			return [jsx('text', undefined, text)]
		case 'A':
			return [jsx('text', { link: (node as HTMLElement).getAttribute('href') }, text)]
		case 'STRONG':
		case 'B':
			return [jsx('text', { bold: true }, text)]
		case 'DEL':
		case 'S':
			return [jsx('text', { strikethough: true }, text)]
		case 'EM':
		case 'I':
			return [jsx('text', { italic: true }, text)]
		case 'U':
			return [jsx('text', { underline: true }, text)]
		case 'CODE':
			return [jsx('text', { code: true }, text)]

		// ELEMENT NODES
		case 'P': {
			const children = childrenOf(node, ['#text'])
			return [jsx('element', { type: 'paragraph' }, children)]
		}
		case 'H1':
		case 'H2':
			return [jsx('element', { type: node.nodeName.replace(/H/, 'header-') }, text)]
		case 'H3':
		case 'H4':
		case 'H5':
		case 'H6':
			return [jsx('element', { type: 'header-3' }, text)]
		case 'UL': {
			const children = childrenOf(node, ['LI'])
			if (children.length === 0) return null
			return [jsx('element', { type: 'bulleted-list' }, children)]
		}
		case 'OL': {
			const children = childrenOf(node, ['LI'])
			if (children.length === 0) return null
			return [jsx('element', { type: 'numbered-list' }, children)]
		}
		case 'LI': {
			const children = childrenOf(node, ['#text']).filter((node) => (node as CustomText).text?.length > 0)

			const li = [jsx('element', { type: 'list-item' }, children.length === 0 ? text : children)]

			if (!parent || !['UL', 'OL'].includes(parent.nodeName)) return [jsx('element', { type: 'bulleted-list' }, li)]
			else return li
		}

		// HYBRID NODES
		case 'SPAN': {
			if (parent && ELEMENT_NODES.includes(node.nodeName)) return [jsx('text', undefined, text)]
			else {
				const children = childrenOf(node, ['#text'])
				return [jsx('element', { type: 'paragraph' }, children)]
			}
		}
	}
}

const exceptions = (document: Document) => {
	// Google Docs
	const gdoc = /^<b.*id="docs-internal-guid-[0-9a-f\-]{36}">/i
	if (gdoc.test(document.body.innerHTML)) {
		return new DOMParser().parseFromString(document.body.innerHTML.replace(gdoc, '').replace(/<\/b>$/, ''), 'text/html')
	}

	// Other exceptions

	return document
}

export const htmlParser = (data: string) => {
	return exceptions(new DOMParser().parseFromString(data, 'text/html'))
}

export const withHtmlParser = (editor: Editor) => {
	const { insertData } = editor

	editor.insertData = (data) => {
		const html = data.getData('text/html')

		if (html) {
			try {
				const parsed = exceptions(new DOMParser().parseFromString(html, 'text/html'))

				const elements = parseNode(parsed.body)
				if (elements) {
					Transforms.insertFragment(editor, elements)
					return
				}
			} catch (_) {}
		}

		// Always fallback to insertData as a failthrough, otherwise won't copy!!
		insertData(data)
	}

	return editor
}

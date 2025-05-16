import { ReactNode } from 'react'
import { Editor, Element, Path, Range, Transforms } from 'slate'
import { RenderElementProps } from 'slate-react'
import styled from 'styled-components'
import { NEmbeds } from '../../../../../../utils/embeds'
import { CustomText } from '../../types'
import { getEmbedObject } from './embedService'

export type EmbedBlock = {
	type: 'embed'
	url: string
	service: string
	width?: number
	height?: number
	children: CustomText[]
	id?: string
	source?: string
}

interface EmbedProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: EmbedBlock
}

export const isValidUrl = (value: string) => {
	value = value.trim()

	try {
		if (!/^https?\:\/\//.test(value)) return false
		new URL(value)
		return true
	} catch (err) {
		return false
	}
}

export const withEmbeds = (editor: Editor) => {
	const { isVoid, insertData, deleteBackward } = editor

	editor.deleteBackward = (...args) => {
		const { selection } = editor

		if (selection && Range.isCollapsed(selection)) {
			const previous = Editor.previous(editor, {
				at: selection,
				voids: true,
				match: (n) => {
					return !Editor.isEditor(n) && Element.isElement(n)
				},
			})

			if (previous && previous[0] && previous[0]?.type === 'embed') {
				Transforms.select(editor, previous[1])
				return
			}
			const [current] = Editor.nodes(editor, {
				at: selection,
				voids: true,
				match: (n) => {
					return !Editor.isEditor(n) && Element.isElement(n) && n.type === 'embed'
				},
			})
			if (current) {
				Transforms.select(editor, Path.previous(current[1]))
				return
			}
		}
		// fall back to other plugins / default behavior
		deleteBackward(...args)
	}

	editor.insertData = (data) => {
		const text = data.getData('text/plain')

		if (isValidUrl(text)) {
			const embed = getEmbedObject(text)
			if (!embed) {
				Transforms.insertNodes(editor, [{ text, link: text }])
				return
			}

			const { source, url, service } = embed

			Transforms.insertNodes(editor, {
				type: 'embed',
				url,
				source,
				service,
				children: [{ text: '' }],
			})
			return
		}

		insertData(data)
	}
	editor.isVoid = (element) => (element.type === 'embed' ? true : isVoid(element))
	return editor
}

export const EmbedBlock = ({ attributes, children, element }: EmbedProps) => {
	const { url } = element

	const service = NEmbeds.embedServicesList[element.service]

	return (
		<div {...attributes}>
			<div contentEditable={false}>
				<IframeContainer
					style={{
						marginBottom: '12px',
						marginTop: '12px',
						margin: 'auto',
						...service.style,
					}}
				>
					<Iframe
						src={`${url}`}
						allowFullScreen
						frameBorder="0"
						style={{
							top: '0',
							left: '0',
							width: '100%',
							height: '100%',
						}}
					/>
				</IframeContainer>
			</div>
			{children}
		</div>
	)
}

const Iframe = styled.iframe`
	position: relative;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

const IframeContainer = styled.div`
	width: 100%;
	margin: var(--ntc-user-block-padding);

	/* aspect-ratio: 16/9; */
`

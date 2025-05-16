import { FileModel } from '@notice-app/models'
import { ReactNode, useState } from 'react'
import { Editor, Path, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSelected } from 'slate-react'
import styled, { useTheme } from 'styled-components'

import { AlignCenter, AlignEnd, AlignStart, EditIcon } from '../../../Icons'
import { MenuSectionTitle } from '../../Components/Menu/MenuSectionTitle'
import { MenuSeparator } from '../../Components/Menu/MenuSeparator'
import { ResizeHandler } from '../../Components/ResizeHandler/ResizeHandler'
import { Show } from '../../Components/Show'
import Tooltip from '../../Components/Tooltip'
import { EditorMethodsContext } from '../../Contexts/EditorMethods.provider'
import { useIsHovered } from '../../hooks/useIsHovered'
import { CustomText } from '../../types'
import { insertDocument } from '../Document/Document'
import { insertVideo } from '../Video/Video'
import { imageExtensions } from './imageExtensions'
import { Modals } from '../../../../../../components/Modal'

export const IMAGE_TYPE = 'image'

type AlignmentType = 'flex-start' | 'center' | 'flex-end'

export type ImageElement = {
	id?: string
	type: typeof IMAGE_TYPE
	url: string
	mimetype?: string | null
	size?: number | null
	width?: string
	alignment?: AlignmentType
	originalName?: string | null
	description?: string | null
	aspectRatio?: number | null
	children: CustomText[]
}

interface ImageElementProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: ImageElement
}

export const Image = ({ attributes, children, element }: ImageElementProps) => {
	const selected = useSelected()
	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)

	const theme = useTheme()

	const isContainerHovered = useIsHovered([referenceElement]).some(Boolean)

	return (
		<FlexDiv alignment={element.alignment} {...attributes} contentEditable={false}>
			{children}
			<ImageContainer ref={setReferenceElement} data-resize-target style={{ width: element.width }}>
				<Show when={isContainerHovered}>
					<ResizeHandler targetRef={referenceElement} element={element} side="left" />
				</Show>
				<StyledImg src={element.url} selected={selected} aspectRatio={element.aspectRatio ?? undefined} />
				<Show when={isContainerHovered}>
					<ResizeHandler targetRef={referenceElement} element={element} side="right" />
				</Show>
			</ImageContainer>
		</FlexDiv>
	)
}

const EditButton = styled.button`
	position: absolute;
	bottom: 16px;
	right: 8px;
	visibility: hidden;

	display: flex;
	flex-grow: 0;
	align-items: center;
	justify-content: center;
	gap: 12px;
	padding: 0;

	border: none;
	outline-style: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.borderLight};

	background-color: ${({ theme }) => theme.colors.white};

	font-size: 14px;
	color: ${({ theme }) => theme.colors.textDark};
	white-space: nowrap;

	cursor: pointer;
	opacity: 0.8;

	height: 36px;
	width: 36px;

	&:hover {
		opacity: 1;
	}
`

export const insertImage = (editor: Editor, file: FileModel.client | string, dropPath?: Path) => {
	let node: any = { type: 'image', children: [{ text: '' }] }

	if (typeof file === 'string') node.url = file
	else node = { ...node, ...file }

	Transforms.insertNodes(editor, node, { at: dropPath })
}

const FlexDiv = styled.div<{ alignment?: AlignmentType }>`
	display: flex;
	justify-content: ${({ alignment }) => alignment};
	margin: var(--ntc-user-block-padding) 0;
`

const StyledImg = styled.img<{ selected: boolean; aspectRatio?: number }>`
	margin: auto;
	width: 100%;
	object-fit: contain;
	aspect-ratio: ${({ aspectRatio }) => aspectRatio};
	background-color: ${({ selected, theme }) => (selected ? theme.colors.primaryLight : 'transparent')};
`

const ImageContainer = styled.div`
	position: relative;
	width: 100%;
`

export const withImages = (editor: Editor, editorMethods: Partial<EditorMethodsContext>) => {
	const { onUploadFile } = editorMethods ?? {}
	const { insertData, isVoid, deleteBackward } = editor

	editor.deleteBackward = (...args) => {
		// TODO: shall not delete image on backward
		deleteBackward(...args)
	}

	editor.isVoid = (element) => {
		return ['image', 'video', 'document'].includes(element.type) ? true : isVoid(element)
	}

	editor.insertData = (data) => {
		const text = data.getData('text/plain')

		const { selection } = editor

		const { files } = data

		const Regex = new RegExp(`^\\s*(https?:\\/\\/|www\\.).+\\.(${imageExtensions.join('|')})(\\?[^\\s]*)?\\s*$`)

		if (
			(files == null || files.length === 0) &&
			text &&
			Regex.test(text) &&
			selection &&
			selection.anchor.offset === 0
		) {
			insertImage(editor, text)
			return
		}

		if (!onUploadFile) {
			console.error('no onUploadFile file method provided')
			insertData(data)
			return
		}

		for (const file of files) {
			const [mime] = file.type.split('/')

			if (mime === 'image' && onUploadFile != null) {
				onUploadFile(file, 'image').then((uploadedFile) => {
					insertImage(editor, uploadedFile)
				})
			}

			if (mime === 'video' && onUploadFile != null) {
				onUploadFile(file, 'video').then((uploadedFile) => {
					insertVideo(editor, uploadedFile)
				})
			}
			if (mime === 'application' && onUploadFile != null) {
				onUploadFile(file, 'application').then((uploadedFile) => {
					insertDocument(editor, uploadedFile)
				})
			}
		}

		insertData(data)
	}

	return editor
}

export const imageActionMenu = (editor: Editor, element: any) => {
	const handleAlignmentChange = (alignment: AlignmentType) => {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { alignment }, { at: path })
	}

	const theme = useTheme()

	return [
		<MenuSeparator key={'divider'} />,
		<MenuSectionTitle text="Alignment" name="Alignement" key="Alignement" subtype="SectionTitle"></MenuSectionTitle>,
		<FlexRowDiv key="align-items">
			<Tooltip content="align-start" placement="top" offset={[0, 4]}>
				<IconContainer
					onClick={() => {
						handleAlignmentChange('flex-start')
					}}
				>
					<AlignStart />
				</IconContainer>
			</Tooltip>
			<Tooltip content="align-center" placement="top" offset={[0, 4]}>
				<IconContainer
					onClick={() => {
						handleAlignmentChange('center')
					}}
				>
					<AlignCenter />
				</IconContainer>
			</Tooltip>
			<Tooltip content="align-end" placement="top" offset={[0, 4]}>
				<IconContainer
					onClick={() => {
						handleAlignmentChange('flex-end')
					}}
				>
					<AlignEnd />
				</IconContainer>
			</Tooltip>
		</FlexRowDiv>,
		<MenuSeparator key={'divider-3'} />,

		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				padding: 8,
				backgroundColor: theme.colors.backgroundLightGrey,
				cursor: 'pointer',
			}}
			// when clicking, it will automatically close the menu
			// @ts-ignore
			autoClose={true}
			onClick={() => {
				Modals.imageDetails.open({ image: element })
			}}
		>
			<EditImgProps>
				Edit image properties
				<EditIcon color={theme.colors.primary} size={12} style={{ marginLeft: 8, marginRight: 4 }} />
			</EditImgProps>
		</div>,
	]
}

export const openImageUploader = (editor: Editor, { openImageUploader }: EditorMethodsContext) => {
	openImageUploader?.call(openImageUploader)
}

const EditImgProps = styled.span`
	cursor: pointer;
	opacity: 0.8;
	:hover {
		opacity: 1;
	}
	color: ${({ theme }) => theme.colors.primary};
`

const FlexRowDiv = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	width: 100%;
	box-sizing: border-box;
	padding: 4px;
`

const IconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	padding: 8px;
	cursor: pointer;
	&:hover {
		background-color: ${({ theme }) => theme.colors.hover};
	}
	svg {
		fill: ${({ theme }) => theme.colors.primary};
	}
`

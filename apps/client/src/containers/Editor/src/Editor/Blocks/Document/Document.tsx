import { FileModel } from '@notice-app/models'
import { ReactNode, useState } from 'react'
import { Editor, Path, Transforms } from 'slate'
import { RenderElementProps } from 'slate-react'
import styled, { useTheme } from 'styled-components'
import { Download01Icon, File06Icon } from '../../../Icons'
import { Loader } from '../../Components/Loader/Loader'
import { EditorMethodsContext } from '../../Contexts/EditorMethods.provider'
import { CustomText } from '../../types'

export const DOCUMENT_TYPE = 'document'

export type DocumentElement = {
	id?: string
	type: typeof DOCUMENT_TYPE
	url: string
	size?: number | null
	originalName?: string | null
	mimetype?: string | null

	children: CustomText[]
}

interface DocumentElementProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: DocumentElement
}

export const Document = ({ attributes, children, element }: DocumentElementProps) => {
	const theme = useTheme()
	const [downloading, setDownloading] = useState(false)

	const bytesToKB = (bytes?: number | null) => {
		if (!bytes) return null

		const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

		let i = 0

		for (i; bytes > 1024; i++) {
			bytes /= 1024
		}

		return bytes.toFixed(1) + ' ' + units[i]
	}

	const onDownload = () => {
		if (!element.url) {
			throw new Error('Resource URL not provided! You need to provide one')
		}
		setDownloading(true)
		fetch(element.url)
			.then((response) => response.blob())
			.then((blob) => {
				setDownloading(false)
				const blobURL = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = blobURL

				if (element.originalName && element.originalName.length) a.download = element.originalName
				document.body.appendChild(a)
				a.click()
			})
			.catch((error) => {
				setDownloading(false)
				console.log(error)
			})
	}

	const convertedSize = bytesToKB(element.size)

	return (
		<Wrapper {...attributes} contentEditable={false}>
			{children}
			<IconContainer>
				<File06Icon color={theme.colors.greyDark} size={20} />
			</IconContainer>
			<Column>
				<Text color={theme.colors.textDark}>{element.originalName}</Text>
				{convertedSize && <Text color={theme.colors.grey}>{convertedSize}</Text>}
			</Column>
			<IconButton onClick={onDownload}>
				{downloading ? (
					<Loader size={20} color={theme.colors.primary} />
				) : (
					<Download01Icon size={20} color={theme.colors.greyDark} />
				)}
			</IconButton>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 8px;

	width: 100%;
	height: fit-content;
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	padding: 8px;
	border-radius: ${({ theme }) => theme.borderRadius};
	margin: var(--ntc-user-block-padding) 0;
`

const Column = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 2px;

	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`

const IconContainer = styled.div`
	flex-shrink: 0;
	display: flex;
	justify-content: center;
	align-items: center;

	width: 36px;
	height: 36px;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.backgroundLightGrey};
`

const IconButton = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: auto;

	width: 36px;
	height: 36px;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: 'transparent';
	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => theme.colors.backgroundLightGrey};

		svg {
			path {
				stroke: ${({ theme }) => theme.colors.primary};
			}
		}
	}
`

const Text = styled.span<{ color: string }>`
	width: 100%;
	font-size: 14px;
	font-weight: normal;
	color: ${({ color }) => color};

	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`

export const insertDocument = (editor: Editor, file: FileModel.client | string, dropPath?: Path) => {
	let node: any = { type: 'document', children: [{ text: '' }] }

	if (typeof file === 'string') node.url = file
	else node = { ...node, ...file }

	Transforms.insertNodes(editor, node, { at: dropPath })
}

export const openDocumentUploader = (editor: Editor, { openDocumentUploader }: EditorMethodsContext) => {
	openDocumentUploader?.call(openDocumentUploader)
}

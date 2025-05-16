import { darken } from 'polished'
import { ChangeEvent, DragEvent, useRef } from 'react'
import { toast } from 'react-toastify'
import styled, { useTheme } from 'styled-components'
import { FileType } from '.'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useUploadFile } from '../../hooks/api/useUploadFile'
import ImageIcon from '../../icons/ImageIcon'
import { UploadIcon } from '../../icons/UploadIcon'
import { Column, Row } from '../Flex'
import { Loader } from '../Loader'
import { useT } from '../../hooks/useT'

type Props = {
	type: FileType
	acceptedTypes: Array<string>
	mimeTypes: Array<string>
}

export const DropZoneArea = ({ type, acceptedTypes, mimeTypes }: Props) => {
	const theme = useTheme()
	const [workspace] = useCurrentWorkspace()
	const fileUpload = useUploadFile()
	const inputFile = useRef<HTMLInputElement | null>(null)
	const acceptAllTypes = mimeTypes[0] === '*'
	const [t] = useT()

	const OpenFileSelector = () => {
		inputFile.current?.click()
	}

	const handleDrag = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			if (!acceptedTypes.includes(e.dataTransfer.files[0].type) && !acceptAllTypes) {
				toast.error('Sorry file type not accepted')
			} else if (type === 'image' && e.dataTransfer.files[0].size > 6291456) {
				toast.error('File size too big, Must be under 6MB.')
			} else if (
				(type === 'video' || type === 'audio' || type === 'application') &&
				e.dataTransfer.files[0].size > 25165824
			) {
				toast.error('File size too big, Must be under 24MB.')
			} else {
				fileUpload.mutateAsync({
					workspace: workspace,
					file: e.dataTransfer.files[0],
					type,
				})
			}
		}
	}

	const handleImageSelection = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		e.stopPropagation()

		if (e.target.files && e.target.files[0]) {
			if (type === 'image' && e.target.files[0].size > 6291456) {
				toast.error('File size too big, Must be under 6MB.')
			} else if (type === 'video' && e.target.files[0].size > 25165824) {
				toast.error('File size too big, Must be under 24MB.')
			} else {
				fileUpload.mutateAsync({
					workspace: workspace,
					file: e.target.files[0],
					type,
				})
			}
		}
	}

	return (
		<StyledColumn style={{ pointerEvents: fileUpload.isLoading ? 'none' : 'auto' }}>
			<DropZone
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				onClick={OpenFileSelector}
			>
				<input
					onChange={handleImageSelection}
					accept={acceptedTypes.join(',')}
					type="file"
					id="file"
					ref={inputFile}
					style={{ display: 'none' }}
				/>
				<Row gap={4}>
					<ImageIcon color={theme.colors.primary}></ImageIcon>
					<ColorPrimary>{t('Drop your file here to start uploading or', 'dropYourFileHere')}</ColorPrimary>
				</Row>
				<AcceptedTypes>
					{acceptAllTypes
						? t('Any type of document is accepted', 'anyDocTypeAccepted')
						: `${t('Accepted types', 'acceptedTypes')} : ${mimeTypes.join(', ')}`}
				</AcceptedTypes>
				<StyledButton
					color={theme.colors.primary}
					onClick={(e) => {
						e.stopPropagation()
						OpenFileSelector()
					}}
				>
					{t('Browse Files', 'browseFiles')}
					{fileUpload.isLoading ? (
						<Loader size={16} color={theme.colors.white} />
					) : (
						<UploadIcon color={theme.colors.white} size={16} />
					)}
				</StyledButton>
			</DropZone>
		</StyledColumn>
	)
}

const StyledColumn = styled(Column)`
	margin: 16px 16px 0;
	padding: 24px;
	border-radius: 4px;
	border: 1px solid rgb(245, 247, 249);
	cursor: pointer;
`

const DropZone = styled.div`
	box-sizing: border-box;
	position: relative;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 12px;
	margin: 0 24px;
	padding: 24px;
	background-color: ${({ theme }) => theme.colors.primaryExtraLight};
	border: 1px dashed ${({ theme }) => theme.colors.primary};
	color: ${({ theme }) => theme.colors.primary};

	&:hover {
		background-color: ${({ theme }) => darken(0.05, theme.colors.primaryExtraLight)};
	}
`

const StyledButton = styled.button`
	padding: 8px 12px;
	font-size: 14px;
	font-weight: 400;
	border-radius: 4px;

	background-color: ${({ theme }) => theme.colors.primary};
	color: ${({ theme }) => theme.colors.white};

	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 8px;
	border: none;
	cursor: pointer;
`

const ColorPrimary = styled.p`
	color: ${({ theme }) => theme.colors.primary};
`
const AcceptedTypes = styled.p`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.primary};
`

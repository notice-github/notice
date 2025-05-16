import { Dispatch, SetStateAction, useRef, useState } from 'react'
import styled from 'styled-components'

import 'cropperjs/dist/cropper.css'
import Cropper, { ReactCropperElement } from 'react-cropper'

import { FileModel } from '@notice-app/models'
import { darken } from 'polished'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useUploadFile } from '../../hooks/api/useUploadFile'
import { useIsHovered } from '../../hooks/useIsHovered'
import { PlusIcon } from '../../icons'
import Cross from '../../icons/Cross'
import MinusIcon from '../../icons/MinusIcon'
import { Row } from '../Flex'
import { Loader } from '../Loader'
import { Menu } from '../Menu'
import { SettingButton } from '../Settings/SettingButton'
import { Show } from '../Show'
import { CropperRefContainer, ICropperRefContainer } from './CropperRefContainer'

interface IProps extends Partial<ICropperRefContainer> {
	source?: FileModel.source
	onSave?: (url: string | null) => void
}

const ImageWithCropper = ({ name, size = 48, picture, editable = true, source, onSave }: IProps) => {
	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLDivElement | null>(null)
	const [selectedFile, setSelectedFile] = useState<string | null>(null)
	const isHovered = useIsHovered([ref]).some(Boolean)

	return (
		<Container ref={setRef}>
			<CropperRefContainer
				setSelectedFile={setSelectedFile}
				picture={picture!}
				onSave={onSave}
				source={source}
				name={name!}
				size={size}
				setMenuOpened={setMenuOpened}
				editable={editable}
			></CropperRefContainer>
			<Show when={selectedFile != null && editable && menuOpened}>
				<FloatingImageEditor
					onSave={onSave}
					anchorRef={ref}
					url={selectedFile!}
					source={source}
					menuOpened={menuOpened}
					setMenuOpened={setMenuOpened}
				></FloatingImageEditor>
			</Show>
			<Show when={editable && picture && isHovered}>
				<DeleteButton onClick={() => onSave?.(null)}>
					<Cross size={13} color="white" />
				</DeleteButton>
			</Show>
		</Container>
	)
}

interface IFloatingEditor {
	anchorRef: HTMLDivElement | null
	url: string
	source?: FileModel.source
	menuOpened: boolean
	setMenuOpened: Dispatch<SetStateAction<boolean>>
	onSave?: (url: string | null) => void
}

const FloatingImageEditor = ({ anchorRef, url, source, menuOpened, setMenuOpened, onSave }: IFloatingEditor) => {
	const [workspace] = useCurrentWorkspace()
	const [file, setFile] = useState<File | null>(null)
	const cropperRef = useRef<ReactCropperElement>(null)
	const uploadFile = useUploadFile()

	const onCrop = async () => {
		const cropper = cropperRef.current?.cropper
		const base64 = cropper?.getCroppedCanvas().toDataURL()
		const res: Response = await fetch(base64!)
		const blob: Blob = await res.blob()

		setFile(new File([blob], blob.name, { type: blob.type }))
	}

	const handleZoomIn = () => {
		const cropper = cropperRef.current?.cropper
		cropper?.zoom(0.1)
	}
	const handleZoomOut = () => {
		const cropper = cropperRef.current?.cropper
		cropper?.zoom(-0.1)
	}

	const handleUploadFile = async () => {
		if (file !== null) {
			const outputFile = await uploadFile.mutateAsync({ workspace, file: file!, type: 'image', source })
			onSave?.(outputFile.url)
			setMenuOpened(false)
		}
	}

	const handleCancel = () => {
		setMenuOpened(false)
	}

	return (
		<Menu closing={menuOpened} anchorRef={anchorRef} disableOutsideClick placement="right-start" offset={[0, 4]}>
			<RelativeDiv>
				<Cropper
					src={url}
					style={{ height: 180, width: '100%', maxWidth: '100%', position: 'relative', boxSizing: 'border-box' }}
					aspectRatio={1}
					center
					dragMode="move"
					highlight={true}
					guides={false}
					crop={onCrop}
					ref={cropperRef}
					minCropBoxHeight={50}
					minCropBoxWidth={50}
					viewMode={0}
				/>
				<ColumnDiv>
					<ZoomContainer onClick={handleZoomIn}>
						<PlusIcon size={12} color="black"></PlusIcon>
					</ZoomContainer>
					<ZoomContainer onClick={handleZoomOut}>
						<MinusIcon size={10} color="black"></MinusIcon>
					</ZoomContainer>
				</ColumnDiv>
				<StyledRow gap={6} justify="flex-end">
					<SettingButton onClick={handleCancel}>Cancel</SettingButton>
					<SettingButton disabled={uploadFile.isLoading} primary onClick={handleUploadFile}>
						{uploadFile.isLoading ? <Loader size={12} color="white" /> : 'Save'}
					</SettingButton>
				</StyledRow>
			</RelativeDiv>
		</Menu>
	)
}

const Container = styled.div`
	width: auto;
	height: auto;
	border-radius: ${({ theme }) => theme.borderRadius};
	overflow: hidden;
`

const RelativeDiv = styled.div`
	position: relative;
	padding: 12px;

	width: 250px;
	height: 100%;
	box-sizing: border-box;
`

const DeleteButton = styled.div`
	position: absolute;
	top: -8px;
	left: 37px;

	width: 15px;
	height: 15px;
	border-radius: 50%;
	background-color: ${({ theme }) => theme.colors.error};
	transition: background-color 0.3s ease;
	text-align: center;

	cursor: pointer;

	display: flex;
	justify-content: center;
	align-items: center;

	&:hover {
		background-color: ${({ theme }) => darken(0.25, theme.colors.error)};
	}
`

const StyledRow = styled(Row)`
	margin: 8px 0 0;
`

const ColumnDiv = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	z-index: 0;

	position: absolute;
	bottom: 65px;
	right: 20px;
`

const ZoomContainer = styled.div`
	width: 24px;
	height: 24px;

	background-color: ${({ theme }) => theme.colors.lightGrey};
	border-radius: 6px;

	display: flex;
	justify-content: center;
	align-items: center;
	transition: background-color 0.3s ease;
	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => darken(0.25, theme.colors.lightGrey)};
	}
`

export default ImageWithCropper

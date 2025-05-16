import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styled, { useTheme } from 'styled-components'
import { FileType, UploaderType } from '.'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useUploadFile } from '../../hooks/api/useUploadFile'
import { useEditor } from '../../hooks/bms/editor/useEditor'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'
import useDebounce from '../../hooks/useDebounce'
import { Button } from '../Button'
import { Drawers } from '../Drawer'
import { Column, Row } from '../Flex'
import { Loader } from '../Loader'
import { Show } from '../Show'
import { SimpleInput } from '../SimpleInput'
import { bytesToKB } from './FileGallery'
import { MediaTypeSelector } from './MediaTypeSelector'
import { useT } from '../../hooks/useT'

interface Props {
	type: FileType
	acceptedTypes: string[]
	uploaderType: UploaderType
	mimeTypes: Array<string>
}

export const URLViewer = ({ type, acceptedTypes, uploaderType, mimeTypes }: Props) => {
	const [url, setUrl] = useState<string>('')
	const [file, setFile] = useState<File | null>(null)

	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(false)

	const [t] = useT()

	const [debouncedValue] = useDebounce<string>(url, 500)

	useEffect(() => {
		const getFile = async () => {
			const file = await blobUrlToFile()
			if (file) {
				setFile(file)
			}
		}
		if (!error && debouncedValue !== '') getFile()
	}, [debouncedValue])

	function fileReader(file: File | null) {
		if (file) return URL.createObjectURL(file)
		return ''
	}

	const [currentPage] = useCurrentPage()

	const [editor] = useEditor(currentPage!)

	const [workspace] = useCurrentWorkspace()

	const imageUpload = useUploadFile()
	const theme = useTheme()

	const handleUrlChange = async (value: string) => {
		setUrl(value)

		const regextext = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(value)

		if (value !== '' && !regextext) {
			setError(true)
		} else {
			setError(false)
			setFile(null)
		}
	}

	const blobUrlToFile = async () => {
		setLoading(true)

		try {
			const data = await fetch(url).then((response) => response.blob())

			const metadata = {
				type: data.type,
				size: data.size,
				name: data.name,
			}

			if (!acceptedTypes.includes(data.type)) {
				setLoading(false)
				toast.error(`Sorry file type not accepted.`)
				return undefined
			}

			if (type === 'image' && data.size > 6291456) {
				setLoading(false)
				toast.error(`File size too big, Must be under 6MB.`)
				return undefined
			} else if ((type === 'video' || type === 'application' || type === 'audio') && data.size > 25165824) {
				setLoading(false)
				toast.error(`File size too big, Must be under 24MB.`)
				return undefined
			}

			const fileName = data.name ?? `notice_${type}.${data.type.split(`${type}/`).join('')}`

			const file = new File([data], fileName, metadata)

			setLoading(false)
			return file
		} catch (e) {
			setError(true)
			setLoading(false)
		}
	}

	const handleSave = async () => {
		if (file) {
			const data = await imageUpload.mutateAsync({
				workspace: workspace,
				file,
				type,
			})

			if (type === 'image') {
				editor.insertImage(data)
			} else if (type === 'video') {
				editor.insertVideo(data)
			} else if (type === 'application') {
				editor.insertDocument(data)
			}

			Drawers[uploaderType as keyof typeof Drawers].close()
		}
	}

	return (
		<StyledColumn gap={4}>
			<h3>{t('Enter an URL', 'enterAnURL')}</h3>
			<SimpleInput
				placeholder={'e.g: https://mysite.com/a_file'}
				type={'text'}
				value={url}
				name={'uploader'}
				onChange={(value) => handleUrlChange(value)}
			/>
			<AcceptedTypes>
				{t('Accepted types', 'acceptedTypes')} : {mimeTypes.join(', ')}
			</AcceptedTypes>
			<Show when={error}>
				<ErrorMessage>{`Failed to fetch ${type}, please check the url (should start with https:// or http://) or try another url.`}</ErrorMessage>
			</Show>
			<Show when={loading}>
				<Width100>
					<Loader />
				</Width100>
			</Show>

			<ImageContainer displayContainer={file !== null && !loading && !error}>
				<MediaTypeSelector
					type={type === 'application' ? 'application-container' : type}
					name={file?.name}
					size={bytesToKB(file?.size!)}
					url={fileReader(file)}
				/>
			</ImageContainer>
			<Show when={!error && url !== '' && !loading && file}>
				<Row justify={'end'} gap={4}>
					<Button
						onClick={() => {
							setUrl('')
						}}
						padding="8px 16px"
						color={theme.colors.grey}
						textColor={theme.colors.white}
						outlined
					>
						cancel
					</Button>
					<Button padding="8px 16px" onClick={handleSave}>
						{' '}
						Save{' '}
					</Button>
				</Row>
			</Show>
		</StyledColumn>
	)
}

const StyledColumn = styled(Column)`
	margin: 16px 16px 0;
	padding: 24px;
	border-radius: 4px;
	border: 1px solid rgb(245, 247, 249);
`

const ImageContainer = styled.div<{ displayContainer: boolean }>`
	display: ${({ displayContainer }) => (displayContainer ? 'flex' : 'none')};
	max-height: 300px;
	width: 100%;
	overflow: hidden;
`

const Width100 = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 16px;
`

const ErrorMessage = styled.p`
	font-size: 12px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.error};
`

const AcceptedTypes = styled.p`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.grey};
`

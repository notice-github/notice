import { FileModel } from '@notice-app/models'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import { useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { toast } from 'react-toastify'
import { FileType, UploaderType } from '.'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useFiles } from '../../hooks/api/useFiles'
import useDebounce from '../../hooks/useDebounce'
import { DownloadIcon } from '../../icons/DownloadIcon'
import { UploadIllustration } from '../../icons/UploadIllustration'
import { Drawers } from '../Drawer'
import { Column, Row } from '../Flex'
import { Loader } from '../Loader'
import { Show } from '../Show'
import { SimpleInput } from '../SimpleInput'
import { MediaTypeSelector } from './MediaTypeSelector'
import { EditIcon } from '../../icons/EditIcon'
import { Modals } from '../Modal'
import { useT } from '../../hooks/useT'

dayjs.extend(calendar)

type Props = {
	type: FileType
	uploaderType: UploaderType
	iconType: string
	onSelected: (file: FileModel.client) => any
}

export const bytesToKB = (bytes: number | null) => {
	if (!bytes) return null

	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

	let i = 0

	for (i; bytes > 1024; i++) {
		bytes /= 1024
	}

	return bytes.toFixed(1) + ' ' + units[i]
}

export const FileGallery = ({ type, uploaderType, iconType, onSelected }: Props) => {
	const [workspace] = useCurrentWorkspace()
	const theme = useTheme()
	const [searchValue, setSearchValue] = useState('')
	const [currentIndex, setCurrentIndex] = useState(0)
	const [deBouncedValue] = useDebounce(searchValue, 500)
	const [t] = useT()

	const [downloading, setDownloading] = useState(false)

	const { data, isLoading } = useFiles(workspace, {
		type,
		source: 'editor',
	})

	// filter out all the cropped files form any images that is not inside the editor

	const filterFiles = (data?: FileModel.client[]) => {
		if (searchValue === '') {
			return data
		}
		return data?.filter((file) => file.originalName?.toLocaleLowerCase().includes(deBouncedValue.toLocaleLowerCase()))
	}

	const download = (url: string, name: string | null) => {
		if (!url) {
			throw new Error('Resource URL not provided! You need to provide one')
		}
		setDownloading(true)
		fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
				setDownloading(false)
				const blobURL = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = blobURL

				if (name && name.length) a.download = name
				document.body.appendChild(a)
				a.click()
			})
			.catch((error) => {
				setDownloading(false)
				toast.error('🥺 Sorry error while downloading, Please try again later', {
					closeOnClick: true,
					autoClose: 5000,
					position: 'top-right',
				})
			})
	}

	const handleFileSelect = (file: FileModel.client) => {
		onSelected(file)
		Drawers[uploaderType as keyof typeof Drawers].close()
	}

	if (!data?.length) {
		return <IllustrationContainer>{isLoading ? <Loader /> : <UploadIllustration />}</IllustrationContainer>
	}

	return (
		<StyledColumn>
			<StickyDiv>
				<SimpleInput
					value={searchValue}
					placeholder={t('Filter files', 'filterFiles')}
					type={'text'}
					name={''}
					onChange={(value) => setSearchValue(value)}
				/>
			</StickyDiv>
			<Show when={isLoading}>
				<StyledRow justify={'center'}>
					<Loader />
				</StyledRow>
			</Show>

			<Show when={filterFiles(data)?.length !== 0 && !isLoading}>
				{filterFiles(data)?.map((file, index) => (
					<StyledRow onClick={() => handleFileSelect(file)} key={file.id} justify={'flex-start'} align="center" gap={8}>
						<ImageContainer>
							<MediaTypeSelector type={iconType} url={file.url} />
						</ImageContainer>
						<Column style={{ width: '80%' }} justify={'start'} align={'start'}>
							<EllipsizedText>{file.originalName}</EllipsizedText>
							<Row justify={'start'} align={'center'} gap={4}>
								<InfoText12>
									{dayjs().calendar(dayjs('03/02/2022'), {
										sameDay: '[Today at] h', // The same day ( Today at 2:30 AM )
										nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
										nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
										lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
										lastWeek: '[Last] dddd', // Last week ( Last Monday at 2:30 AM )
										sameElse: 'DD/MMM/YY', // Everything else ( 7/10/2011 )
									})}
								</InfoText12>
								<GreySpan> • </GreySpan>
								<InfoText12>{bytesToKB(file?.size)}</InfoText12>
								<GreySpan> • </GreySpan>
								<EllipsizedInfo>{file?.mimetype ? file.mimetype.split(`${type}/`) : ''}</EllipsizedInfo>
							</Row>
						</Column>
						<EditIconContainer
							key={file.id}
							onClick={(e) => {
								e.stopPropagation()
								e.preventDefault()
								setCurrentIndex(index)
								Modals.imageDetails.open({ image: file })
							}}
							onMouseEnter={(e) => e.stopPropagation()}
						>
							<EditIcon color={theme.colors.primary} size={12} />
						</EditIconContainer>
						<IconContainer
							key={file.id}
							onClick={(e) => {
								e.stopPropagation()
								e.preventDefault()
								setCurrentIndex(index)
								download(file.url, file.originalName)
							}}
							onMouseEnter={(e) => e.stopPropagation()}
						>
							{downloading && currentIndex === index ? (
								<Loader size={16} />
							) : (
								<DownloadIcon color={theme.colors.primary} />
							)}
						</IconContainer>
					</StyledRow>
				))}
			</Show>

			<Show when={!filterFiles(data)?.length && !isLoading}>
				<EmptyMessage>No Files Found</EmptyMessage>
			</Show>
		</StyledColumn>
	)
}

const StyledColumn = styled(Column)`
	margin: 16px 16px;
	padding: 0 24px 24px;
	border-radius: 4px;
	border: 1px solid rgb(245, 247, 249);

	max-height: calc(100vh - 424px + 48px);
	overflow: auto;
	position: relative;
`

const StickyDiv = styled.div`
	position: sticky;
	top: 0;
	padding: 24px 0 16px;
	background-color: ${({ theme }) => theme.colors.white};
`

const ImageContainer = styled.div`
	height: 32px;
	width: 32px;
	background-color: ${({ theme }) => theme.colors.backgroundLightGrey};
	border-radius: 4px;
	flex-shrink: 0;

	justify-content: center;
	display: flex;
	align-items: center;
`

const EllipsizedText = styled.p`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`

const StyledRow = styled(Row)`
	margin-top: 12px;
	padding: 8px 24px;
	cursor: pointer;
	border-radius: 4px;
	&:hover {
		background-color: ${({ theme }) => theme.colors.primaryExtraLight};
	}
`

const GreySpan = styled.span`
	font-weight: 700;
	font-size: 16px;
	text-align: center;
	color: ${({ theme }) => theme.colors.textLightGrey};
`

const InfoText12 = styled.p`
	flex-shrink: 0;
	font-size: 12px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.textLightGrey};

	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`

const EllipsizedInfo = styled.p`
	font-size: 12px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.textLightGrey};
	width: 40%;

	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`

const EditIconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: auto;
	width: 24px;
	height: 24px;

	border: 1px solid transparent;
	:hover {
		opacity: 0.8;
		background-color: ${({ theme }) => theme.colors.hover};
		border: 1px solid ${({ theme }) => theme.colors.border};
	}
`

const IconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: auto;
	width: 24px;
	height: 24px;
	border: 1px solid transparent;
	:hover {
		opacity: 0.8;
		background-color: ${({ theme }) => theme.colors.hover};
		border: 1px solid ${({ theme }) => theme.colors.border};
	}
`

const EmptyMessage = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	margin: 12px 0;
	font-size: 14px;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.sweetpink};
`
const IllustrationContainer = styled.div`
	width: 250px;
	height: 250px;
	margin: auto;
	padding: 24px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

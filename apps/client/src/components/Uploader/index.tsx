import { FileModel } from '@notice-app/models'
import { useState } from 'react'
import styled from 'styled-components'
import { Show } from '../Show'
import { DropZoneArea } from './DropZoneArea'
import { FileGallery } from './FileGallery'
import { UploaderTab } from './Tab'
import { URLViewer } from './URLViewer'
import { useT } from '../../hooks/useT'

export type UploaderTabType = 'files' | 'url'
export type UploaderType = 'imageUploader' | 'videoUploader' | 'documentUploader' | 'audioUploader'
export type FileType = 'image' | 'video' | 'audio' | 'application'

type Props = {
	acceptedTypes: Array<string>
	mimeTypes: Array<string>
	uploaderType: UploaderType
	type: FileType
	translationkey: any
	iconType: string
	onSelected: (file: FileModel.client) => any
}

const defaultTranslation = (type?: string) => {
	switch (type) {
		case 'audio':
			return 'Select an Audio'
		case 'video':
			return 'Select a Video'
		case 'application':
			return 'Select a Document'
		case 'image':
		default:
			return 'Select An Image'
	}
}

export const Uploader = ({
	acceptedTypes,
	type,
	translationkey,
	mimeTypes,
	iconType,
	uploaderType,
	onSelected,
}: Props) => {
	const [selectedTab, setSelectedTab] = useState<UploaderTabType>('files')
	const [t] = useT()

	return (
		<Width100>
			<Title>{t(defaultTranslation(type), translationkey)}</Title>
			<TabContainer>
				<TabBar>
					<UploaderTab
						title={t('Files', 'files')}
						selected={selectedTab === 'files'}
						onClick={() => setSelectedTab('files')}
					/>
					<UploaderTab title={'URL'} selected={selectedTab === 'url'} onClick={() => setSelectedTab('url')} />
				</TabBar>
			</TabContainer>
			<Show when={selectedTab === 'files'}>
				<DropZoneArea type={type} mimeTypes={mimeTypes} acceptedTypes={acceptedTypes} />
				<FileGallery uploaderType={uploaderType} type={type} iconType={iconType} onSelected={onSelected} />
			</Show>
			<Show when={selectedTab === 'url'}>
				<URLViewer mimeTypes={mimeTypes} acceptedTypes={acceptedTypes} uploaderType={uploaderType} type={type} />
			</Show>
		</Width100>
	)
}

const Width100 = styled.div`
	width: 100%;
	height: 100%;
`

const Title = styled.div`
	font-size: 24px;
	padding: 16px 24px;
	font-weight: 700;
	line-height: 24px;
	color: ${({ theme }) => theme.colors.textGrey};
`

const TabBar = styled.div`
	display: flex;
	justify-content: flex-start;
	margin-top: 16px;
	padding: 0 24px;
	gap: 16px;
	border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
`

const TabContainer = styled.div`
	display: flex;
	flex-direction: column;
	background-color: white;
	width: 100%;
	height: 100%;
`

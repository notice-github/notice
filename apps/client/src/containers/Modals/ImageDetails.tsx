import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useT } from '../../hooks/useT'
import { useFile, useUpdateFile } from '../../hooks/api/useFiles'
import { EditIcon } from '../../icons/EditIcon'
import { darken } from 'polished'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'
import { BlockModel } from '@notice-app/models'

export interface ImageDetailsProps {
	image: any
}

// "image" is the MongoDB block data (not the PSQL data)
export function ImageDetails({ image }: ImageDetailsProps) {
	const [page] = useCurrentPage()
	const [t] = useT()

	const { data } = useFile(image.url)

	if (!data || !page) return null

	// This is the PSQL data
	const { id, mimetype, originalName, size, source, url, description = '' } = data

	// Can edit the name of the image, the description
	return (
		<Container>
			<Title>{t('Image', 'image')}</Title>
			<img width="100%" src={image.url} alt={image.name} />
			<Column>
				<ImageName url={image.url} originalName={originalName ?? id} page={page}></ImageName>
				<ImageDescription url={image.url} description={description ?? ''} page={page} />
				{size && (
					<InfoWrapper>
						<H3>Size</H3>
						<div>{size}</div>
					</InfoWrapper>
				)}
				<InfoWrapper>
					<H3>Format</H3>
					<div style={{ fontStyle: 'italic' }}>{mimetype}</div>
				</InfoWrapper>
				<InfoWrapper>
					<H3>URL</H3>

					<Link href={url} target="_blank">
						{url}
					</Link>
				</InfoWrapper>
			</Column>
		</Container>
	)
}

export const ImageDescription = ({
	description,
	url,
	page,
}: {
	description: string
	url: string
	page: BlockModel.block
}) => {
	const [t] = useT()
	const [desc, setDesc] = useState(description)
	const [editing, setEditing] = useState(false)
	const theme = useTheme()

	const updateFile = useUpdateFile(url, page)

	return (
		<InfoWrapper>
			<div style={{ display: 'flex', alignItems: 'baseline' }}>
				<H3>{t('Description', 'description')}</H3>
				{!editing && (
					<EditNameContainer onClick={() => setEditing(true)}>
						<EditIcon color={theme.colors.primary} size={12} />
					</EditNameContainer>
				)}
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
				{editing ? (
					<ImageDescriptionInput
						autoFocus={true}
						placeholder={t('Write your image description here (Max. 125 characters).', 'writeYourImageDesc')}
						maxLength={125}
						value={desc}
						onChange={(e) => {
							setDesc(e.target.value)
						}}
						key="image-input-desc"
					></ImageDescriptionInput>
				) : (
					<EditableSpan onClick={() => setEditing(true)}>
						{desc === '' ? '❗️ No description ❗️ Please provide one for accessibility and SEO' : desc}
					</EditableSpan>
				)}
				{editing && (
					<div style={{ display: 'flex', gap: 8 }}>
						<Button
							onClick={() => {
								setEditing(false)
								setDesc(description)
							}}
						>
							Cancel
						</Button>
						<Button
							color={theme.colors.primary}
							onClick={() => {
								updateFile.mutateAsync({ description: desc })
								setEditing(false)
							}}
						>
							Save
						</Button>
					</div>
				)}
			</div>
		</InfoWrapper>
	)
}

export const ImageName = ({
	originalName,
	url,
	page,
}: {
	originalName: string
	url: string
	page: BlockModel.block
}) => {
	const [t] = useT()
	const [localName, setLocalName] = useState(originalName)
	const theme = useTheme()
	const [editing, setEditing] = useState(false)

	const updateFile = useUpdateFile(url, page)

	return (
		<InfoWrapper>
			<div style={{ display: 'flex', alignItems: 'baseline', marginTop: 8 }}>
				<h3>{t('Name', 'name')}</h3>

				{!editing && (
					<EditNameContainer onClick={() => setEditing(true)}>
						<EditIcon color={theme.colors.primary} size={12} />
					</EditNameContainer>
				)}
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
				{editing ? (
					<NameInput
						maxLength={100}
						autoFocus={true}
						value={localName}
						onChange={(e) => setLocalName(e.target.value)}
					/>
				) : (
					<EditableSpan onClick={() => setEditing(true)}>{localName}</EditableSpan>
				)}
				{editing && (
					<div style={{ display: 'flex', gap: 8 }}>
						<Button
							onClick={() => {
								setEditing(false)
								setLocalName(originalName)
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={async () => {
								await updateFile.mutateAsync({ originalName: localName })
								setEditing(false)
							}}
							color={theme.colors.primary}
						>
							Save
						</Button>
					</div>
				)}
			</div>
		</InfoWrapper>
	)
}

const Button = styled.button<{ color?: string }>`
	display: flex;
	flex-grow: 0;
	align-items: center;
	justify-content: center;
	gap: 12px;
	padding: 6px 12px;

	border: none;
	outline-style: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.borderLight};

	background-color: ${({ theme, color }) => color ?? theme.colors.white};

	font-size: 14px;
	color: ${({ theme, color }) => (color ? 'white' : theme.colors.textDark)};
	white-space: nowrap;

	cursor: pointer;

	&:hover {
		background-color: ${({ color }) => darken(0.05, color ?? 'white')};
	}
`
const EditableSpan = styled.div`
	min-height: 17px;
	font-style: italic;
	cursor: pointer;
	:hover {
		background-color: ${({ theme }) => theme.colors.hover};
	}
	padding: 8px;
	border-radius: 8px;
`

const H3 = styled.h3`
	margin-bottom: 4px;
`

const NameInput = styled.input`
	width: 100%;
	box-sizing: border-box;
	font-family: inherit;
	outline: none;
	overflow: hidden;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 8px;
	background: none;
	width: 100%;
	display: block;
	resize: none;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textDark};
	padding: 8px;

	::placeholder {
		font-style: italic;
	}
`

const EditNameContainer = styled.div`
	margin-left: 8px;
	cursor: pointer;
	:hover {
		opacity: 0.8;
	}
	color: ${({ theme }) => theme.colors.primary};
`

const Link = styled.a`
	color: ${({ theme }) => theme.colors.primary};
	text-decoration: none;
`

const InfoWrapper = styled.div``

const Column = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`

const Title = styled.h1`
	font-style: normal;
	font-weight: 700;
	font-size: 26px;
	margin-bottom: 12px;
`

const Container = styled.div`
	min-height: 600px;
	width: 600px;
	padding: 24px;
	user-select: none;
`

const ImageDescriptionInput = styled.textarea`
	box-sizing: border-box;
	font-family: inherit;
	outline: none;
	overflow: hidden;
	height: 63px;
	font-size: inherit;
	line-height: inherit;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 8px;
	background: none;
	width: 100%;
	display: block;
	resize: none;
	padding: 8px;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textDark};

	::placeholder {
		font-style: italic;
	}
`

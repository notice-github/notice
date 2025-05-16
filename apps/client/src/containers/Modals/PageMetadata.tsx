import { BlockModel } from '@notice-app/models'
import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Loader } from '../../components/Loader'
import { Modals } from '../../components/Modal'
import { useCollaborators } from '../../hooks/api/useCollaborators'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useUpdatePage } from '../../hooks/bms/page/useUpdatePage'
import { useT } from '../../hooks/useT'
import { ZapIcon } from '../../icons/ZapIcon'
import { Pages } from '../../pages'
import { Router } from '../../router'
import { Tags } from '../Editor/src/Editor/Tags'
import { useSearchParam } from '../../hooks/useSearchParam'
import { Tooltip } from 'react-tooltip'
import { QuestionMark } from '../../icons/QuestionMark'

interface Props {
	page: BlockModel.block
}

// TODO: we shall add a loading state when the page is not loaded yet
export const PageMetadata = ({ page }: Props) => {
	const [t] = useT()
	const [workspace] = useCurrentWorkspace()
	const collaborators = useCollaborators(workspace.id)
	const updatePage = useUpdatePage()
	const [loading, setLoading] = useState(false)
	const [pageId, setPageId] = useSearchParam('page')
	const theme = useTheme()
	const [editing, setEditing] = useState(false)

	const { datePublished = '', tags = [], summary = '', author = { name: '', picture: '' } } = page?.metadata
	const [localMeta, setLocalMeta] = useState<Record<string, any>>({
		datePublished,
		tags,
		summary,
		author,
	})

	useEffect(() => {
		// we switch the pageId to switch the user to the correct page (way easier to handle)
		if (page?.id !== pageId) setPageId(page.id)
	}, [])

	useEffect(() => {
		if (localMeta.author || !collaborators.data?.[0]) return

		setLocalMeta({
			...localMeta,
			author: {
				name: collaborators.data[0].username,
				picture: collaborators.data[0].picture || undefined,
			},
		})
	}, [collaborators.data])

	const updateLocalMeta = (key: string, value: any) => {
		setLocalMeta({ ...localMeta, [key]: value })
	}

	const saveMetadata = async () => {
		if (!page) return

		setLoading(true)
		await updatePage.mutateAsync({ page, metadata: localMeta })
		setLoading(false)

		Modals.pageMetadata.close()
	}

	return (
		<Container>
			<Title>
				<ZapIcon style={{ marginRight: 8 }} />
				{t('Page Medadata', 'pageMetadata')}
			</Title>
			<Hint style={{ marginBottom: 32 }}>
				{t('Enrich this page with information for improved SEO and previews', 'giveInformationForSEO')}
			</Hint>
			<InputsContainer>
				<InputContainer>
					<Label>{t('Tags', 'tags')}</Label>
					<Tags
						setTags={(tags: string[]) =>
							setLocalMeta({
								...localMeta,
								tags,
							})
						}
						tags={localMeta.tags}
					/>
				</InputContainer>

				<InputContainer>
					<Label>{t('Publication date', 'datePublished')}</Label>

					<Hint>
						{t(
							'By setting a date in the future it will hide the page until the chosen date.',
							'explanationDateOfPublication'
						)}
					</Hint>
					{/* If the date is in the future, add a warning <Hint /> */}
					{new Date(localMeta.datePublished) > new Date() && (
						<Hint style={{ color: theme.colors.sweetpurple }}>
							{t('This article is hidden because the date is in the future.', 'articleHiddenDateFuture')}
						</Hint>
					)}

					<DateInput
						onChange={(e) => updateLocalMeta('datePublished', e.target.value)}
						type="date"
						value={localMeta.datePublished}
					/>
				</InputContainer>
				<InputContainer>
					<Label>
						{t('Author', 'author')} -{' '}
						<EditAuthor onClick={() => Router._router.navigate(Pages.SETTINGS_ACCOUNT)}>
							{t('Edit my profile', 'editMyName')}
						</EditAuthor>
					</Label>

					<Select
						onChange={(e) => {
							const collab = collaborators.data?.find((c) => c.username === e.target.value)
							if (!collab) return

							updateLocalMeta('author', {
								name: collab.username,
								picture: collab.picture || undefined,
							})
						}}
						value={localMeta.author?.name}
					>
						{collaborators.data?.map((collaborator) => <option key={collaborator.id}>{collaborator.username}</option>)}
					</Select>
				</InputContainer>
				<InputContainer>
					<Label>{t('Summary', 'summary')}</Label>
					{editing ? (
						<SummaryInputTextArea
							autoFocus={true}
							placeholder={t('Write a summary of the page here (Max. 300 characters).', 'writeYourPageSummary')}
							maxLength={300}
							value={localMeta.summary}
							onChange={(e) => {
								updateLocalMeta('summary', e.target.value)
							}}
							key="desc-summary-input"
						></SummaryInputTextArea>
					) : (
						<EditableSpan onClick={() => setEditing(true)}>
							{localMeta.summary === '' ? `There's no summary 🥲. Please provide one. ` : localMeta.summary}
						</EditableSpan>
					)}
				</InputContainer>
			</InputsContainer>
			<ButtonGroup>
				{loading ? (
					<Loader />
				) : (
					<>
						<Button variant="cancel" onClick={() => Modals.pageMetadata.close()}>
							{t('Cancel', 'cancel')}
						</Button>

						<Button onClick={saveMetadata}>{t('Save', 'save')}</Button>
					</>
				)}
			</ButtonGroup>
		</Container>
	)
}

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

const SummaryInputTextArea = styled.textarea`
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

const Label = styled.h3`
	font-size: 17px !important;
`

const Button = styled.button<{ variant?: 'cancel' }>`
	padding: 8px 16px;
	border-radius: 4px;
	border: none;
	background-color: ${({ theme, variant }) => (variant === 'cancel' ? 'white' : theme.colors.primary)};
	color: ${({ theme, variant }) => (variant === 'cancel' ? theme.colors.error : 'white')};
	cursor: pointer;
	:hover {
		background-color: ${({ theme, variant }) => (variant === 'cancel' ? 'white' : theme.colors.primaryDark)};
		opacity: ${({ variant }) => (variant === 'cancel' ? 0.8 : 1)};
	}
`

const Select = styled.select`
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 4px;
	padding: 8px 12px;
	box-sizing: border-box;
	appearance: none;
`

const EditAuthor = styled.span`
	cursor: pointer;
	:hover {
		text-decoration: underline;
	}
	color: ${({ theme }) => theme.colors.primary};
`

const DateInput = styled.input`
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 4px;
	padding: 8px 12px;
`

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`

const InputsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
`

const Container = styled.div`
	min-width: 500px;
	padding: 24px;
	user-select: none;
	* {
		${({ theme }) => theme.fonts.regular};
		font-size: 14px;
	}
`

const Title = styled.h1`
	font-style: normal;
	font-weight: 700;
	font-size: 26px;
	margin-bottom: 12px;
`

const Hint = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
`

const ButtonGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 16px;
	gap: 8px;
`

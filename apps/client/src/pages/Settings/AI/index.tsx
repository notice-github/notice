import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Column, Row } from '../../../components/Flex'
import { FloatingMessageBox } from '../../../components/FloatingMessageBox'
import { Loader } from '../../../components/Loader'
import { SettingsCard } from '../../../components/Settings/SettingCard'
import { Show } from '../../../components/Show'
import Tooltip from '../../../components/Tooltip'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useUpdateWorkspace } from '../../../hooks/api/useUpdateWorkspace'
import { useWorkspaceInfos } from '../../../hooks/api/workspace/useWorkspaceInfo'
import useAutoSizeTextArea from '../../../hooks/useAutoSizeTextArea'
import { useT } from '../../../hooks/useT'
import Cross from '../../../icons/Cross'
import { EditIcon } from '../../../icons/EditIcon'
import Tick from '../../../icons/Tick'
import { SettingDropdown } from '../../../components/Settings/SetingDropdown'
import { FaqIcon } from '../../../icons/ProjectIcons'

export const SettingsAI = () => {
	const [t] = useT()
	const [workspace] = useCurrentWorkspace()
	const workspaceInfo = useWorkspaceInfos(workspace)
	const theme = useTheme()
	const { aiPromptExample, aiTone, companyDescription, aiModel } = workspaceInfo.data || {}

	const [isReadOnly, setIsReadOnly] = useState(true)
	const [showMessage, setShowMessage] = useState(false)

	const [descriptionAreaRef, setDescriptionAreaRef] = useState<HTMLTextAreaElement | null>(null)
	const [toneAreaRef, setToneAreaRef] = useState<HTMLTextAreaElement | null>(null)
	const [exampleAreaRef, setExampleAreaRef] = useState<HTMLTextAreaElement | null>(null)

	const defaultFormValue = {
		companyDescription: companyDescription ?? '',
		aiTone: aiTone ?? '',
		aiPromptExample: aiPromptExample ?? '',
	}

	const [formData, setFormData] = useState(defaultFormValue)

	useAutoSizeTextArea(descriptionAreaRef, formData.companyDescription)
	useAutoSizeTextArea(toneAreaRef, formData.aiTone)
	useAutoSizeTextArea(exampleAreaRef, formData.aiPromptExample)

	useEffect(() => {
		setTimeout(() => {
			if (showMessage) {
				setShowMessage(false)
			}
		}, 4000)
	}, [showMessage])

	useEffect(() => {
		setFormData(defaultFormValue)
	}, [workspaceInfo.data])

	const updateWorkspace = useUpdateWorkspace()

	const onSubmit = () => {
		updateWorkspace.mutate({ workspace, ...formData })
		setIsReadOnly(true)
	}

	const onCancel = () => {
		setFormData(defaultFormValue)
		setIsReadOnly(true)
	}

	return (
		<Container>
			<Row gap={4} justify="space-between" align="center">
				<Title>
					<span>{workspace.name}</span> {t('AI Settings', 'aiSettings')}
				</Title>
			</Row>
			<Description>
				{t(
					'Welcome to AI Settings, where you take control of how our AI generates content for this workspace.',
					'aiSettingsDescription'
				)}
			</Description>

			<SettingsCard
				title={t('AI Settings', 'aiSettings')}
				button={
					<Row>
						<Show when={isReadOnly && !updateWorkspace.isLoading && !workspaceInfo.isLoading}>
							<FloatingMessageBox
								content={t('Please click to edit the settings', 'PleaseClickToEditTheSettings')}
								placement="top"
								offset={[0, 10]}
								show={showMessage}
							>
								<div>
									<Tooltip placement="top" content={t('Edit', 'edit')} offset={[0, 4]}>
										<IconButtonWrapper
											color={theme.colors.primaryDark}
											onMouseEnter={() => setShowMessage(false)}
											onClick={() => {
												setIsReadOnly(false)

												setTimeout(() => {
													descriptionAreaRef?.focus()
												}, 100)
											}}
										>
											<EditIcon size={14} color={theme.colors.white} />
										</IconButtonWrapper>
									</Tooltip>
								</div>
							</FloatingMessageBox>
						</Show>
						<Show when={updateWorkspace.isLoading || workspaceInfo.isLoading}>
							<IconButtonWrapper color={theme.colors.primaryDark}>
								<Loader size={16} color={theme.colors.white} />
							</IconButtonWrapper>
						</Show>
						<Show when={!isReadOnly && !updateWorkspace.isLoading}>
							<Row gap={8} justify="center" align="center">
								<Tooltip placement="top" content={t('Save', 'save')} offset={[0, 4]}>
									<IconButtonWrapper color={theme.colors.textGreen} onClick={onSubmit}>
										<Tick size={16} color={theme.colors.white} />
									</IconButtonWrapper>
								</Tooltip>
								<Tooltip placement="top" content={t('Cancel', 'cancel')} offset={[0, 4]}>
									<IconButtonWrapper color={theme.colors.textRed} onClick={onCancel}>
										<Cross size={16} color={theme.colors.white} />
									</IconButtonWrapper>
								</Tooltip>
							</Row>
						</Show>
					</Row>
				}
			>
				<Column gap={26}>
					<StyledColumn gap={8}>
						<CardTitle> {t(' What do you do ?', 'aiSettingSection1')}</CardTitle>
						<Description>
							{t(
								`Help us understand your line of work or your company's focus. Please provide a brief description of your business or profession.`,
								'aiSettingSection1Description'
							)}
						</Description>
						<StyledTextArea
							ref={setDescriptionAreaRef}
							onFocus={() => isReadOnly && setShowMessage(true)}
							readOnly={isReadOnly || updateWorkspace.isLoading}
							placeholder={t(
								`I run a creative agency that specializes in digital marketing strategies and content creation`,
								'aiSettingSection1Placeholder'
							)}
							value={formData.companyDescription}
							onChange={(e) => {
								setFormData((prev) => ({ ...prev, companyDescription: e.target.value }))
							}}
						></StyledTextArea>
					</StyledColumn>

					<StyledColumn gap={4}>
						<CardTitle> {t('What is your tone ?', 'aiSettingSection2')} </CardTitle>
						<Description>
							{t(
								`Define the tone you desire for the text in your workspace. Share with us the kind of tone that aligns with
							your communication style.`,
								'aiSettingSection2Description'
							)}
						</Description>
						<StyledTextArea
							ref={setToneAreaRef}
							readOnly={isReadOnly || updateWorkspace.isLoading}
							onFocus={() => isReadOnly && setShowMessage(true)}
							placeholder={t(
								`We sound professional but friendly, sharing our expertise in a way that's easy to connect with`,
								'aiSettingSection2Placeholder'
							)}
							value={formData.aiTone}
							onChange={(e) => {
								setFormData((prev) => ({ ...prev, aiTone: e.target.value }))
							}}
						></StyledTextArea>
					</StyledColumn>
					<StyledColumn gap={4}>
						<CardTitle>{t('Example of your optimal prompt', 'aiSettingSection3')} </CardTitle>
						<Description>
							{t(
								`Provide one or two examples of prompts you'd like our AI to respond to. This will help us tailor the content
							generation to better suit your needs.`,
								'aiSettingSection3Description'
							)}
						</Description>

						<StyledTextArea
							ref={setExampleAreaRef}
							readOnly={isReadOnly || updateWorkspace.isLoading}
							placeholder={t(
								`Prompt 1: "Generate a compelling blog post about the latest industry trends."

							Prompt 2: "Create a succinct FAQ section highlighting the five key aspects of our service."`,
								'aiSettingSection3Placeholder'
							)}
							value={formData.aiPromptExample}
							onFocus={() => isReadOnly && setShowMessage(true)}
							onChange={(e) => {
								setFormData((prev) => ({ ...prev, aiPromptExample: e.target.value }))
							}}
						></StyledTextArea>
					</StyledColumn>
				</Column>
			</SettingsCard>
			{/* <SettingsCard title={t('AI Model Settings', 'aiSettingsModelSettings')}>
				<Column gap={26}>
					<StyledColumn gap={8}>
						<CardTitle> {t('Choose your AI model', 'aiSettingModelSection')}</CardTitle>
						<Description>
							{t(`Select the AI generation model that best fits your preferences.`, 'aiSettingModelSectionDescription')}
						</Description>
						<SettingDropdown
							values={['gpt-4o-mini', 'gpt-4']}
							currentValue={aiModel ?? 'GPT 4'}
							displayName={(name) => {
								if (name === 'gpt-4') {
									return 'GPT 4'
								} else {
									return 'GPT 4o mini'
								}
							}}
							displayIcon={(value) => {
								if (value === 'gpt-4') {
									return (
										<Tooltip content={t('More optimized', 'aiSettingGPT4Tooltip')} placement="left">
											<IconWrapper>
												<FaqIcon color={theme.colors.textLightGrey} size={16} />
											</IconWrapper>
										</Tooltip>
									)
								} else {
									return (
										<Tooltip content={t('Faster', 'aiSettingGPT3Tooltip')} placement="left">
											<IconWrapper>
												<FaqIcon color={theme.colors.textLightGrey} size={16} />
											</IconWrapper>
										</Tooltip>
									)
								}
							}}
							onUpdate={(value) => {
								updateWorkspace.mutate({ workspace, aiModel: value })
							}}
							style={{ width: '130px' }}
						/>
					</StyledColumn>
				</Column>
			</SettingsCard> */}
		</Container>
	)
}

const Container = styled.div`
	width: 100%;
	overflow-wrap: break-word;
`

const Title = styled.h1`
	font-weight: 700;
	color: ${({ theme }) => theme.colors.textDark};

	span {
		color: ${({ theme }) => theme.colors.primaryDark};
	}
`

const IconWrapper = styled.div``

const CardTitle = styled.h2`
	font-size: 18px;
	font-weight: 700;
`

const Description = styled.p`
	inline-size: 700px;
	color: ${({ theme }) => theme.colors.textGrey};
	overflow-wrap: break-word;
`

const StyledColumn = styled(Column)`
	box-sizing: border-box;
	width: 100%;
`

const StyledTextArea = styled.textarea`
	box-sizing: border-box;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;

	-moz-appearance: textfield-multiline;
	-webkit-appearance: textarea;

	min-height: 60px;
	width: 100%;
	overflow: scroll;
	outline: none;
	resize: none;
	// transition: height 0.3s ease;

	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	padding: 12px 16px;
	border-radius: ${({ theme }) => theme.borderRadius};

	&::placeholder {
		color: ${({ theme }) => theme.colors.textLightGrey};
	}

	&:focus-within {
		border-color: ${({ theme }) => theme.colors.primary};
	}

	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textDark};
`

const IconButtonWrapper = styled.div<{ color: string }>`
	display: flex;
	justify-content: center;
	align-items: center;

	width: 30px;
	height: 30px;

	border-radius: ${({ theme }) => theme.borderRadius};
	cursor: pointer;
	background-color: ${({ color }) => color};
	transition: opacity 0.2s ease-in-out;

	&:hover {
		opacity: 0.8;
	}
`

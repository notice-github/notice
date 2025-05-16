import { darken } from 'polished'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { NCheckers } from '@notice-app/utils'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useUploadFile } from '../../../hooks/api/useUploadFile'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { LogoIcon } from '../../../icons/LogoIcon'
import { Loader } from '../../Loader'
import { SettingButton } from '../../Settings/SettingButton'
import { SimpleInput } from '../../SimpleInput'
import { useT } from '../../../hooks/useT'

interface Props {
	onPropertyChange: OnPropertyChange
	hideWebsiteSections?: boolean
}

export const LogoSection = ({ onPropertyChange, hideWebsiteSections = false }: Props) => {
	const [t] = useT()
	const [workspace] = useCurrentWorkspace()
	const [project] = useCurrentProject()
	const uploadFile = useUploadFile()
	const theme = useTheme()

	const currentValue = project?.preferences?.logoUrl
	const currentUrlValue = project?.preferences?.websiteUrl

	const inputRef = useRef<HTMLInputElement>(null)
	const [image, setImage] = useState(currentValue ?? '')
	const [isLoading, setLoading] = useState(false)

	const [url, setURL] = useState<string | null>(null)
	const isURL = useMemo(() => NCheckers.isURL(url), [url])

	useEffect(() => {
		if (currentValue != null) setImage(currentValue)
		if (currentUrlValue != null) setURL(currentUrlValue)
	}, [currentValue, currentUrlValue])

	const onClick = () => {
		inputRef.current?.click()
	}

	const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file == null) return

		setLoading(true)

		try {
			const outputFile = await uploadFile.mutateAsync({ workspace: workspace, file: file, type: 'image' })
			setImage(outputFile.url)
			onPropertyChange('preferences', 'logoUrl', outputFile.url)
		} catch (ex) {}

		setLoading(false)
	}

	return (
		<>
			<Container>
				<InputWrapper>
					<LogoContainer onClick={onClick}>
						{image === '' && !isLoading && <LogoIcon size={64} />}
						{!isLoading && image !== '' && <LogoImage src={image} />}
						{isLoading && <Loader />}
					</LogoContainer>
					<ButtonWrapper>
						<SettingButton onClick={onClick}>{t('Upload an image', 'uploadImage')}</SettingButton>
						<UploadHelp>
							{t('You can configure your logo to redirect to your choice.', 'configureLogoRedirect')}
						</UploadHelp>
						<SimpleInput
							type="text"
							value={url!}
							onChange={(value) => setURL(value.trim())}
							onBlur={(value) => {
								if (value === currentValue) return
								onPropertyChange('preferences', 'websiteUrl', value.trim())
							}}
							textColor={!isURL ? theme.colors.error : undefined}
							placeholder="https://www.[domain].com"
						/>
					</ButtonWrapper>
				</InputWrapper>
			</Container>
			<HiddenInput ref={inputRef} type="file" accept="image/*" onChange={onFileChange} />
		</>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`

const InputWrapper = styled.div`
	display: flex;
	gap: 16px;
`

const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex: 0;
`

const UploadHelp = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textLightGrey};
`

const LogoContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	padding: 8px;

	aspect-ratio: 1;

	flex: 3;

	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	border-radius: 4px;

	cursor: pointer;

	&:hover {
		background-color: ${({ color }) => darken(0.05, color ?? 'white')};
	}
`

const LogoImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`

const HiddenInput = styled.input`
	width: 0px;
	height: 0px;
	display: none;
`

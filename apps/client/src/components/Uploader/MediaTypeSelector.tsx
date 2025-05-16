import styled, { useTheme } from 'styled-components'
import { File06Icon } from '../../icons'
import { VideoIcon } from '../../icons/VideoIcon'
import { AudioIcon } from '../../containers/Editor/src/Icons/Audio.icon'
type Props = {
	type: string
	url?: string
	name?: string
	size?: string | null
}

export const MediaTypeSelector = ({ type, url, name, size }: Props) => {
	const theme = useTheme()
	switch (type) {
		case 'image':
			return <StyledImage alt="type" src={url} />
		case 'video':
			return <StyledVideo poster="" src={url} preload="auto" playsInline controls></StyledVideo>
		case 'object':
			return <StyledObject data={url}></StyledObject>
		case 'video-icon':
			return <VideoIcon color={theme.colors.primary} />
		case 'audio-icon':
			return <AudioIcon color={theme.colors.primary} size={16} />
		case 'file-icon':
		case 'application':
			return <File06Icon size={18} color={theme.colors.primaryDark} />
		case 'application-container':
			return (
				<ApplicationContainer>
					<IconContainer>
						<File06Icon color={theme.colors.greyDark} size={20} />
					</IconContainer>
					<Column>
						<Text color={theme.colors.textDark}>{name}</Text>
						<Text color={theme.colors.grey}>{size}</Text>
					</Column>
				</ApplicationContainer>
			)

		default:
			return <StyledImage alt="type" src={url} />
	}
}

const StyledImage = styled.img`
	height: 100%;
	width: 100%;
	object-fit: contain;
	border-radius: 4px;
	box-sizing: border-box;
	overflow-clip-margin: content-box;
	overflow: clip;
`

const StyledVideo = styled.video`
	height: auto;
	width: 100%;
`
const StyledObject = styled.object`
	height: 100%;
	width: 100%;
`

const ApplicationContainer = styled.div`
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 8px;

	width: 80%;
	height: fit-content;
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	padding: 8px;
	border-radius: ${({ theme }) => theme.borderRadius};
	margin: 12px auto;
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

const Text = styled.span<{ color: string }>`
	width: 100%;
	font-size: 14px;
	font-weight: normal;
	color: ${({ color }) => color};

	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`

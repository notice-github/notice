import styled from 'styled-components'

import { NUrls } from '@notice-app/utils'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'

interface Props {
	reloadKey: string
}

export const MobilePreview = ({ reloadKey }: Props) => {
	const [project] = useCurrentProject()

	return (
		<Container>
			<Wrapper>
				<StyledImg src="https://assets.notice.studio/editor/mobile-raw.svg" />
				<URL>{project?.preferences?.domain || project?.id}.notice.site</URL>
				<IFrameWrapper>
					{project != null && (
						<iframe
							key={`mobile-${reloadKey}`}
							title="Preview - Notice"
							src={NUrls.App.previewURL(project.id)}
							style={{ height: '100%', width: '100%', border: '0' }}
						></iframe>
					)}
				</IFrameWrapper>
			</Wrapper>
		</Container>
	)
}

const Container = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	user-select: none;
`

const Wrapper = styled.div`
	position: relative;
`

const StyledImg = styled.img``

const URL = styled.p`
	position: absolute;
	top: 11%;
	left: 21%;
	max-width: 65%;

	font-size: 10px;
	color: ${({ theme }) => theme.colors.textGrey};
	overflow: scroll;
	white-space: nowrap;

	-ms-overflow-style: none;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`

const IFrameWrapper = styled.div`
	position: absolute;
	top: 17%;
	left: 6.4%;

	width: 116.3%;
	height: 105.3%;

	border-bottom-left-radius: 42px;
	border-bottom-right-radius: 42px;
	overflow: hidden;

	transform: scale(0.75);
	transform-origin: top left;
`

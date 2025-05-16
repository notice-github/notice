import styled from 'styled-components'

import { NUrls } from '@notice-app/utils'
import { useRef } from 'react'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'

interface Props {
	reloadKey: string
}

export const DesktopPreview = ({ reloadKey }: Props) => {
	const [project] = useCurrentProject()

	const iframeRef = useRef<HTMLIFrameElement>(null)

	return (
		<Container>
			<Wrapper>
				<StyledImg src="https://assets.notice.studio/editor/desktop-raw.svg" />
				<URL>{project?.preferences?.domain || project?.id}.notice.site</URL>
				<IFrameWrapper>
					{project != null && (
						<iframe
							ref={iframeRef}
							key={`desktop-${reloadKey}`}
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

const StyledImg = styled.img`
	width: 100%;
`

const URL = styled.p`
	position: absolute;
	top: 9%;
	left: 13.2%;
	font-size: 9px;
	color: ${({ theme }) => theme.colors.textGrey};
`

const IFrameWrapper = styled.div`
	position: absolute;
	top: 13.3%;
	left: 1.4%;

	width: 149.5%;
	height: 128.2%;

	border-bottom-left-radius: 11px;
	border-bottom-right-radius: 11px;
	overflow: hidden;

	transform: scale(0.65);
	transform-origin: top left;
`

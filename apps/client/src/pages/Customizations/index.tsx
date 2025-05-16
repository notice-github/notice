import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { CustomizationTabs } from '../../components/Customizations'
import { DesktopPreview } from '../../components/Customizations/Preview/Desktop'
import { MobilePreview } from '../../components/Customizations/Preview/Mobile'
import { Row } from '../../components/Flex'
import { Page } from '../../components/Page'
import { PageBody } from '../../components/Page/PageBody'
import { PageContent } from '../../components/Page/PageContent'
import { PageHead, PageHeadIcon, PageHeadTitle } from '../../components/Page/PageHead'
import { PageSide } from '../../components/Page/PageSide'
import { PublishButton } from '../../components/PublishButton'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { usePublishState } from '../../hooks/bms/usePublishState'
import { useT } from '../../hooks/useT'
import DesktopIcon from '../../icons/DesktopIcon'
import MobileIcon from '../../icons/MobileIcon'
import { Pages } from '../../pages'

type PreviewType = 'desktop' | 'mobile' | 'loading'

export const CustomisationsPage = () => {
	const [t] = useT()
	const navigate = useNavigate()
	const [workspace] = useCurrentWorkspace()
	const [previewType, setPreviewType] = useState<PreviewType>('desktop')
	const [reloadKey, setReloadKey] = useState(crypto.randomUUID())
	const lastReload = useRef(new Date())
	const state = usePublishState()

	useEffect(() => {
		if (workspace.myRole === 'viewer') {
			navigate(Pages.EDITOR, { replace: true })
		}
	}, [])

	useEffect(() => {
		// the reload key forces the rerendering of the preview <iframe />
		if (Date.now() - lastReload.current.getTime() > 100) {
			lastReload.current = new Date()
			setReloadKey(crypto.randomUUID())
		}
	}, [state.dataUpdatedAt])

	return (
		<Page minWidth="1250px">
			<PageSide width="519px">
				<StyledPageHead>
					<PageHeadIcon src="/assets/svg/customization.svg" />
					<PageHeadTitle>{t('Customization', 'customization')}</PageHeadTitle>
				</StyledPageHead>
				<StyledPageBody>
					<CustomizationTabs />
				</StyledPageBody>
			</PageSide>
			<PageContent>
				<PreviewWrapper>
					{previewType === 'desktop' && <DesktopPreview reloadKey={reloadKey} />}
					{previewType === 'mobile' && <MobilePreview reloadKey={reloadKey} />}
					<Row gap={6} align="center" justify={'center'}>
						<Row align="center" justify={'center'}>
							<IconButton selected={previewType === 'desktop'} onClick={() => setPreviewType('desktop')}>
								<DesktopIcon />
							</IconButton>
							<IconButton selected={previewType === 'mobile'} onClick={() => setPreviewType('mobile')}>
								<MobileIcon />
							</IconButton>
						</Row>
						<PublishButton />
					</Row>
				</PreviewWrapper>
			</PageContent>
		</Page>
	)
}

const StyledPageHead = styled(PageHead)`
	display: flex;
	align-items: center;
	gap: 16px;
	border: none;
	padding: 16px;
`

const StyledPageBody = styled(PageBody)`
	padding: 0;
`

const IconButton = styled.div<{ selected: boolean }>`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 8px;
	width: 40px;
	height: 40px;
	border-radius: 4px;
	z-index: 1;
	background-color: ${({ selected, theme }) => (selected ? theme.colors.hover : 'transparent')};
	color: ${({ selected, theme }) => (selected ? theme.colors.primary : 'auto')};
	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => theme.colors.hover};
	}
`

const PreviewWrapper = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

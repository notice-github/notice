import styled from 'styled-components'

import { Row, Spacer } from '../../../components/Flex'
import { PublishButton } from '../../../components/PublishButton'
import { Show } from '../../../components/Show'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useCurrentPage } from '../../../hooks/bms/page/useCurrentPage'
import { useT } from '../../../hooks/useT'
import { DropIcon, EarthIcon, PuzzleIcon, StatsIcon } from '../../../icons'
import { Pages } from '../../../pages'
import { NavButton } from './NavButton'
import { StateIndicator } from './StateIndicator'

export const Header = () => {
	const [t] = useT()
	const [workspace] = useCurrentWorkspace()
	const [currentPage] = useCurrentPage()

	const hasProject = currentPage !== undefined

	return (
		<Wrapper>
			<Row gap={16} height="100%">
				{workspace.myRole !== 'viewer' && (
					<NavButton
						// onClick={() =>
						// 	trackEvent.mutate({
						// 		id: user.email,
						// 		eventName: 'Reaches customization page',
						// 		data: { origin: 'nav button', context: 'app usage' },
						// 	})
						// }
						icon={<DropIcon />}
						text={t('Customization', 'customization')}
						link={Pages.CUSTOMIZATION_GENERAL}
						disabled={!hasProject}
					/>
				)}
				{workspace.myRole !== 'viewer' && (
					<NavButton
						// onClick={() =>
						// 	trackEvent.mutate({
						// 		id: user.email,
						// 		eventName: 'Reaches translation page',
						// 		data: { origin: 'nav button', context: 'app usage' },
						// 	})
						// }
						icon={<EarthIcon />}
						text={t('Translation', 'translation')}
						link={Pages.TRANSLATIONS}
						disabled={!hasProject}
					/>
				)}
				<Spacer />
				<OptionsWrapper>
					<Show when={currentPage != null}>
						<StateIndicator page={currentPage!} />
					</Show>
					{/* <NavButton
						icon={<PuzzleIcon />}
						text={t('Integrations', 'integrations')}
						link={Pages.INTEGRATIONS}
						disabled={!hasProject}
					/> */}
					<PublishButton showOptions={true} />
				</OptionsWrapper>
			</Row>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	height: 48px;
	padding: 0 16px;

	background-color: ${({ theme }) => theme.colors.white};
	border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
	box-shadow: rgb(0 0 0 / 5%) 0px 0px 7px;
`

const OptionsWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;
`

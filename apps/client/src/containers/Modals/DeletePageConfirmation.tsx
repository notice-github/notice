import { PageModel } from '@notice-app/models'
import styled, { useTheme } from 'styled-components'

import { Button } from '../../components/Button'
import { Modals } from '../../components/Modal'
import { useActivePages } from '../../hooks/bms/page/useActivePages'
import { useDeletePage } from '../../hooks/bms/page/useDeletePage'
import { useSearchParam } from '../../hooks/useSearchParam'
import { useT } from '../../hooks/useT'

interface Props {
	page: PageModel.node
}

export const DeletePageConfirmation = ({ page }: Props) => {
	const theme = useTheme()
	const [t] = useT()

	const [, setPageId] = useSearchParam('page')
	const activePages = useActivePages()
	const deletePage = useDeletePage()

	return (
		<Container>
			<Title>{t('Delete Page', 'deletePageDeletePage')}</Title>
			<Text16>
				{t(
					'This action will permanently delete this page and all its related content, are you sure you want to continue?',
					'deletePageAreYouSure'
				)}
			</Text16>
			<br />
			<Text16>{t('This action cannot be undone.', 'deleteWarning')}</Text16>
			<Footer>
				<Button
					padding="8px 16px"
					color={theme.colors.white}
					textColor={theme.colors.error}
					style={{ fontWeight: 600, border: `2px solid ${theme.colors.error}` }}
					onClick={() => Modals.deletePageConfirmation.close()}
				>
					{t('Cancel', 'cancelButton')}
				</Button>
				<Button
					padding="8px 16px"
					color={theme.colors.error}
					style={{ fontWeight: 600 }}
					loader={deletePage.isLoading}
					onClick={async () => {
						if (deletePage.isLoading) return
						await deletePage.mutateAsync({ page })

						const idx = activePages.findIndex((p) => p.id === page.id)
						if (idx > 0) setPageId(activePages[idx - 1].id)

						Modals.deletePageConfirmation.close()
					}}
				>
					{t('Confirm', 'confirmButton')}
				</Button>
			</Footer>
		</Container>
	)
}

const Container = styled.div`
	width: 427px;
	padding: 32px;
`

const Title = styled.h1`
	font-size: 20px;
	margin-bottom: 24px;
`

const Text16 = styled.p`
	font-size: 16px;
	line-height: 22.4px;
`

const Footer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: end;
	gap: 16px;
	margin-top: 30px;
`

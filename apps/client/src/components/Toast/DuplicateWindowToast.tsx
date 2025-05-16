import { toast } from 'react-toastify'
import styled from 'styled-components'
import { Column, Row } from '../Flex'
import { useT } from '../../hooks/useT'

export const DuplicateWindowToast = () => {
	const [t] = useT()
	return (
		<>
			<Column align="flex-start" gap={4}>
				<Row gap={6} align="center" justify="center">
					<span style={{ fontSize: '18px' }}>⚠️</span>
					<Title>{t('Another Notice Tab is opened', 'anotherNoticeTabIsOpened')}</Title>
				</Row>
				<Description>
					{t('Please reload this window before using to avoid data mismatch.', 'pleaseReloadToAvoidMismatch')}
				</Description>
			</Column>
			<ReloadButton
				onClick={() => {
					location.reload()
				}}
			>
				{t('Reload', 'reload')}
			</ReloadButton>
		</>
	)
}

export const callDuplicateWindowToast = () => {
	toast.warning(<DuplicateWindowToast />, {
		position: 'top-right',
		closeOnClick: false,
		hideProgressBar: false,
		autoClose: false,
		icon: false,
		toastId: 'duplicate-tab-container',
	})
}

const Title = styled.h5`
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.greyDark};
`

const Description = styled.p`
	font-size: 14px;
	margin: 0;
	color: ${({ theme }) => theme.colors.textGrey};
`

const ReloadButton = styled.button`
	padding: 8px 12px;
	background-color: transparent;
	color: ${({ theme }) => theme.colors.textGrey};
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	border-radius: 4px;
	cursor: pointer;

	text-align: center;

	display: flex;
	margin-left: auto;
	font-size: 14px;

	&:hover {
		background-color: ${({ theme }) => theme.colors.lightGrey};
	}
`

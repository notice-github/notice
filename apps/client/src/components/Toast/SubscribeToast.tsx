import { toast } from 'react-toastify'
import styled from 'styled-components'
import { Pages } from '../../pages'
import { Router } from '../../router'
import { Column, Row } from '../Flex'
import { ROUTED_TOAST, dismissToasts } from './RoutedToastContainer'

interface IProps {
	message?: string
}

const SubscribeToast = ({ message }: IProps) => {
	return (
		<Row align="center" gap={4}>
			<Column style={{ width: '70%' }} align="flex-start" gap={4}>
				<Title>⚠️ You need to subscribe</Title>
				<Description>
					{message
						? message
						: `Your current plan doesn't allow you access this feature, checkout the other plans we offer.`}
				</Description>
			</Column>
			<ConfigureButton
				onClick={() => {
					Router._router.navigate(Pages.SETTINGS_SUBSCRIPTION), dismissToasts()
				}}
			>
				Subscribe
			</ConfigureButton>
		</Row>
	)
}

export const callSubscriptionToast = (message?: string) => {
	toast.warning(<SubscribeToast message={message} />, {
		hideProgressBar: true,
		closeOnClick: false,
		autoClose: 15000,
		icon: false,
		containerId: ROUTED_TOAST,
	})
}

const Title = styled.h5`
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.textDark};
`

const Description = styled.p`
	font-size: 14px;
	margin: 0;
	color: ${({ theme }) => theme.colors.textGrey};
`

const ConfigureButton = styled.button`
	padding: 8px;
	width: auto;
	background-color: transparent;
	color: ${({ theme }) => theme.colors.textGrey};
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	border-radius: 4px;

	cursor: pointer;
	display: flex;
	width: 32%;

	text-align: center;

	&:hover {
		background-color: ${({ theme }) => theme.colors.lightGrey};
	}
`

export default SubscribeToast

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled, { useTheme } from 'styled-components'

export const ROUTED_TOAST = 'ROUTED_TOAST'

const RoutedToastContainer = () => {
	const theme = useTheme()
	return (
		<RepositionedToastContainer
			containerId={ROUTED_TOAST}
			position={toast.POSITION.TOP_RIGHT}
			limit={1}
			style={{
				// TODO use emotion wrapper and encapsulate this
				backgroundColor: theme.colors.white,
				zIndex: theme.zIndex.toast,
				boxShadow: '0 3px 8px rgba(34, 24, 0, 0.25)',
				color: theme.colors.textDark,
			}}
		/>
	)
}

export const dismissToasts = () => toast.dismiss()

// https://fkhadra.github.io/react-toastify/how-to-style/#extend-existing-css-classes
const RepositionedToastContainer = styled(ToastContainer)`
	&.Toastify__toast-container--top-right {
		top: 80px;
	}

	.Toastify__close-button {
		color: ${({ theme }) => theme.colors.textDark};
	}
`

export default RoutedToastContainer

import { darken } from 'polished'
import styled, { DefaultTheme, useTheme } from 'styled-components'
import { Loader } from '../Loader'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
	primary?: boolean
	dangerous?: boolean
	disabled?: boolean
	padding?: string
	loader?: boolean
}

const getColors = (theme: DefaultTheme, { primary, dangerous, disabled }: Props) => {
	if (disabled) return { color: theme.colors.greyLight, text: theme.colors.textLight, border: theme.colors.borderLight }
	else if (primary) return { color: theme.colors.primary, text: theme.colors.textLight, border: theme.colors.primary }
	else if (dangerous) return { color: theme.colors.error, text: theme.colors.textLight, border: theme.colors.error }
	else return { color: 'white', text: theme.colors.textDark, border: theme.colors.borderLight }
}

export const SettingButton = ({ children, onClick, ...props }: Props) => {
	const theme = useTheme()

	const colors = getColors(theme, props)

	return (
		<Button
			color={colors.color}
			textColor={colors.text}
			borderColor={colors.border}
			disabled={props.disabled}
			onClick={props.disabled ? undefined : onClick}
			{...props}
		>
			{children}
			{props.loader && <Loader size={14} color={colors.text} />}
		</Button>
	)
}

const Button = styled.button<{
	color: string
	textColor: string
	borderColor: string
	disabled?: boolean
	padding?: string
}>`
	display: flex;
	flex-grow: 0;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: ${({ padding }) => padding ?? '8px 16px'};

	border: none;
	outline-style: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	border: 1px solid ${({ borderColor }) => borderColor};

	background-color: ${({ color }) => color};

	font-size: 14px;
	color: ${({ textColor }) => textColor};
	white-space: nowrap;

	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

	&:hover {
		background-color: ${({ color, disabled }) => (disabled ? undefined : darken(0.08, color ?? 'white'))};
	}

	transition:
		background-color 0.3s ease,
		border 0.3s ease,
		color 0.3s ease;
`

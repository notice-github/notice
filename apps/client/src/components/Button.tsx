import { darken, lighten } from 'polished'
import styled, { useTheme } from 'styled-components'

import { Loader } from './Loader'
import { Show } from './Show'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
	color?: string
	textColor?: string
	borderColor?: string

	outlined?: boolean
	loader?: boolean
	dark?: boolean
	padding?: string
	disabled?: boolean

	children: React.ReactNode
}

export const Button = ({
	color,
	textColor,
	borderColor,
	outlined = false,
	loader = false,
	dark = false,
	padding,
	children,
	...props
}: Props) => {
	const theme = useTheme()

	return (
		<StyledButton
			color={color ?? theme.colors.primary}
			textColor={textColor ?? theme.colors.white}
			borderColor={borderColor}
			outlined={outlined}
			loader={loader}
			dark={dark}
			padding={padding}
			{...props}
		>
			{children}
			<Show when={loader}>
				<Loader style={{ marginLeft: 8 }} size={16} color={textColor ?? theme.colors.white} />
			</Show>
		</StyledButton>
	)
}

const StyledButton = styled.button<Props>`
	display: flex;
	flex-grow: 0;
	align-items: center;
	justify-content: center;
	gap: 8px;

	padding: ${({ padding }) => padding ?? '12px 32px'};

	border: none;
	outline-style: none;
	border-radius: ${({ theme }) => theme.borderRadius};

	background-color: ${({ color }) => color};

	font-size: 15px;
	color: ${({ textColor }) => textColor};

	box-shadow: ${({ outlined, borderColor, color }) =>
		outlined ? `${borderColor ?? lighten(0.08, color!)} 0px 0px 0px 1px inset` : undefined};

	user-select: none;
	cursor: ${({ loader, disabled }) => (loader ? 'not-allowed' : disabled ? undefined : 'pointer')};
	opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

	&:hover {
		background-color: ${({ color, dark, loader, disabled }) =>
			!loader && !disabled ? (dark ? lighten : darken)(0.08, color!) : undefined};
	}
`

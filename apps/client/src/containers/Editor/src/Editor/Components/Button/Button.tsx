import { darken, lighten } from 'polished'
import styled, { useTheme } from 'styled-components'
import { Loader } from '../Loader/Loader'
import { Show } from '../Show'
import React from 'react'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
	color?: string
	textColor?: string

	outlined?: boolean
	loader?: boolean | string
	dark?: boolean

	children: React.ReactNode
	style?: React.CSSProperties
}

export const Button = ({
	color,
	textColor,
	outlined = false,
	loader = false,
	dark = false,
	children,
	...props
}: Props) => {
	const theme = useTheme()

	return (
		<StyledButton
			color={color ?? theme.colors.primary}
			textColor={textColor ?? theme.colors.white}
			outlined={outlined}
			loader={loader}
			dark={dark}
			{...props}
		>
			{children}
			<Show when={loader}>
				<Loader style={{ marginLeft: 8 }} size={16} color={theme.colors.white} />
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

	padding: 12px 32px;

	border: none;
	outline-style: none;
	border-radius: ${({ theme }) => theme.borderRadius};

	background-color: ${({ color }) => color};

	font-size: 15px;
	color: ${({ textColor }) => textColor};

	box-shadow: ${({ outlined, color }) => (outlined ? `${lighten(0.08, color!)} 0px 0px 0px 1px inset` : undefined)};

	cursor: ${({ loader, disabled }) => (loader || disabled ? 'not-allowed' : 'pointer')};

	&:hover {
		background-color: ${({ color, dark, loader }) => (!loader ? (dark ? lighten : darken)(0.08, color!) : undefined)};
	}
`

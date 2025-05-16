import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import { BetaTag } from '../../../components/BetaTag'
import { Row } from '../../../components/Flex'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	icon: React.ReactElement
	text: string
	link: string
	isBeta?: boolean
	disabled?: boolean
}

export const NavButton = ({ icon, text, link, isBeta, disabled = false, onClick }: Props) => {
	const theme = useTheme()

	return (
		<Button to={link} disabled={disabled}>
			<Row onClick={onClick} align="center" gap="8px" height="100%">
				{React.cloneElement(icon, { color: theme.colors.greyDark })}
				<Text>{text}</Text>
				{isBeta && <BetaTag small />}
			</Row>
		</Button>
	)
}

const Button = styled(NavLink)<{ disabled: boolean }>`
	text-decoration: none;

	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
	pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};
	opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
	user-select: none;

	&:hover {
		svg path {
			fill: ${({ theme }) => theme.colors.primary};
		}
		p {
			color: ${({ theme }) => theme.colors.primary};
		}
	}
`

const Text = styled.p`
	color: ${({ theme }) => theme.colors.greyDark};
`

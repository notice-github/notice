import { darken } from 'polished'
import { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
	children: ReactNode
	backgroundColor?: string
	margin?: string
}

export const AlertBox = ({ children, backgroundColor, margin }: Props) => {
	return (
		<Container backgroundColor={backgroundColor} margin={margin}>
			{children}
		</Container>
	)
}

const Container = styled.div<Pick<Props, 'backgroundColor' | 'margin'>>`
	padding: 20px;
	position: relative;
	border-radius: 8px;
	border-left: 5px solid ${({ backgroundColor }) => darken(0.2, backgroundColor ?? '#FFCD64')};
	margin: ${({ margin }) => margin ?? '8px'};

	background: ${({ backgroundColor }) => backgroundColor ?? '#ffd48a'};

	h3 {
		font-weight: 500;
		font-size: 14px;
	}
`

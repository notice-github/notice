import styled from 'styled-components'

type Align = 'start' | 'end' | 'center' | 'stretch' | (string & {})
type Justify = 'start' | 'end' | 'center' | 'space-between' | (string & {})

interface FlexProps {
	align?: Align
	justify?: Justify
	gap?: number | string
	height?: string
}

export const Row = styled.div<FlexProps>`
	display: flex;
	align-items: ${(props) => props.align};
	justify-content: ${(props) => props.justify};
	gap: ${(props) => (typeof props.gap === 'number' ? `${props.gap}px` : props.gap)};
	height: ${(props) => props.height};
`

export const Column = styled.div<FlexProps>`
	display: flex;
	flex-direction: column;
	align-items: ${(props) => props.align};
	justify-content: ${(props) => props.justify};
	gap: ${(props) => (typeof props.gap === 'number' ? `${props.gap}px` : props.gap)};
	height: ${(props) => props.height};
`

export const Spacer = styled.div`
	flex-grow: 1;
`

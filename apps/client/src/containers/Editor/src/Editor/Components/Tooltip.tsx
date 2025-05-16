import { ReactElement, ReactNode, useState } from 'react'
import { PopperProps, usePopper } from 'react-popper'
import styled from 'styled-components'
import { useIsHovered } from '../hooks/useIsHovered'
import { Portal } from './Portal'
import { Show } from './Show'

interface Props {
	children: ReactElement
	content: ReactNode
	placement?: PopperProps<never>['placement']
	offset?: [number, number]
}

export const Tooltip = ({ children, content, placement, offset }: Props) => {
	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
	const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
	const isHovered = useIsHovered([referenceElement]).some(Boolean)

	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: placement ?? 'bottom-start',
		modifiers: offset
			? [
					{
						name: 'offset',
						options: {
							offset: offset,
						},
					},
			  ]
			: undefined,
	})

	return (
		<>
			<div ref={setReferenceElement}>{children}</div>
			<Show when={isHovered}>
				<Portal>
					<ToolTipBox ref={setPopperElement} style={styles.popper} {...attributes.popper}>
						{content}
					</ToolTipBox>
				</Portal>
			</Show>
		</>
	)
}

export default Tooltip

const ToolTipBox = styled.div`
	border-radius: 4px;
	padding: 6px;
	color: ${({ theme }) => theme.colors.white};
	background: ${({ theme }) => theme.colors.dark};

	font-size: 12px;
	white-space: nowrap;

	z-index: ${({ theme }) => theme.zIndex.tooltip};
`

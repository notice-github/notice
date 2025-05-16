import React, { ReactElement, ReactNode, useState } from 'react'
import { PopperProps, usePopper } from 'react-popper'
import styled from 'styled-components'
import { Portal } from './Portal'
import { Show } from './Show'

interface Props {
	show: boolean
	children: ReactElement
	content: ReactNode
	placement?: PopperProps<never>['placement']
	offset?: [number, number]
}

export const FloatingMessageBox = ({ show, children, content, placement, offset }: Props) => {
	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
	const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)

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

	const referenceChild: React.ReactElement<any, string | React.JSXElementConstructor<any>> = React.cloneElement(
		children,
		{
			ref: setReferenceElement,
		}
	)

	return (
		<>
			{referenceChild}
			<Show when={show}>
				<Portal>
					<MessageBox ref={setPopperElement} style={styles.popper} {...attributes.popper}>
						{content}
					</MessageBox>
				</Portal>
			</Show>
		</>
	)
}

const MessageBox = styled.div`
	position: relative;
	border-radius: 4px;
	padding: 6px 8px;
	color: ${({ theme }) => theme.colors.white};
	background: ${({ theme }) => theme.colors.error};

	font-size: 12px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

	z-index: ${({ theme }) => theme.zIndex.modal};

	text-align: center;
	height: fit-content;
	width: fit-content;

	max-width: 250px;
	overflow-wrap: break-word;

	&:after {
		border-right: solid 8px transparent;
		border-left: solid 8px transparent;
		border-top: solid 8px ${({ theme }) => theme.colors.error};
		transform: translateX(-50%);
		position: absolute;
		content: '';
		top: 100%;
		left: 50%;
		height: 0;
		width: 0;
		z-index: 1;
	}
`

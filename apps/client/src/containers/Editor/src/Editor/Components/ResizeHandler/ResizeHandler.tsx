import { Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import styled, { css } from 'styled-components'

interface IProps {
	side: string
	targetRef: HTMLElement | null
	element: any
}
export function ResizeHandler({ targetRef, side, element }: IProps) {
	const editor = useSlate()

	const handleWidthChange = (width: string) => {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { width }, { at: path })
	}

	// set max and min width
	const minWidth = 64
	const maxWidth = 700

	function onMouseDown() {
		const { right, left } = targetRef!.getBoundingClientRect()

		// we allow user to only resize horizontally
		// we track the horizontal movement and calculate the width and change the bms data
		function resize(e: MouseEvent) {
			const mousePos = e[`clientX`]
			if (side === 'right') {
				if (mousePos - left < minWidth) {
					handleWidthChange(`${minWidth}px`)
				} else if (mousePos - left > maxWidth) {
					handleWidthChange(`${maxWidth}px`)
				} else {
					handleWidthChange(`${mousePos - left}px`)
				}
			}

			if (side === 'left') {
				if (right - mousePos < minWidth) {
					handleWidthChange(`${minWidth}px`)
				} else if (right - mousePos > maxWidth) {
					handleWidthChange(`${maxWidth}px`)
				} else {
					handleWidthChange(`${right - mousePos}px`)
				}
			}
		}

		// add an event listener for mouse movements that calls the resize function
		window.addEventListener('mousemove', resize)
		window.addEventListener(
			'mouseup',
			() => {
				window.removeEventListener('mousemove', resize)
			},
			{ once: true }
		)
	}

	return <ResizeHandle side={side} onMouseDown={onMouseDown} />
}

const ResizeHandle = styled.div<{ side: string }>`
	position: absolute;

	${({ side }) => {
		if (side === 'left') {
			return css`
				left: 0;
				top: 0;
				height: 100%;
				width: 15px;
				cursor: col-resize;
			`
		} else {
			return css`
				right: 0;
				top: 0;
				height: 100%;
				width: 15px;
				cursor: col-resize;
			`
		}
	}}

	&::after {
		content: '';
		background-color: ${({ theme }) => theme.colors.dark};
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		border-radius: 20px;
		border: 0.5px solid ${({ theme }) => theme.colors.primaryExtraLight};
		width: 4px;
		height: 48px;
		max-height: 50%;
	}
`

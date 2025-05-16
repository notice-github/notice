import { useEffect, useRef } from 'react'
import styled from 'styled-components'

interface Props extends Pick<React.ComponentPropsWithoutRef<'input'>, 'style'> {
	value: string
	editable: boolean
	onChange?: (value: string) => any
}

export const EditableTitle = ({ value, editable, onChange, ...props }: Props) => {
	const ref = useRef<HTMLParagraphElement | null>(null)

	useEffect(() => {
		if (editable) ref.current!.focus()
	}, [editable])

	return (
		<Text
			ref={ref}
			onBlur={(e) => {
				onChange?.call(onChange, (e.target.innerText ?? value).trim())
				e.target.scroll(0, 0)
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					onChange?.call(onChange, (e.currentTarget.innerText ?? value).trim())
					e.currentTarget.scroll(0, 0)
				}
			}}
			onFocus={(e) => {
				if (window.getSelection) {
					const selection = window.getSelection()
					const range = document.createRange()
					range.selectNodeContents(e.target)
					selection?.removeAllRanges()
					selection?.addRange(range)
				}
			}}
			onClick={(e) => {
				if (editable) e.stopPropagation()
			}}
			editable={editable}
			contentEditable={editable}
			suppressContentEditableWarning
			{...props}
		>
			{value}
		</Text>
	)
}

const Text = styled.span<{ editable: boolean }>`
	color: ${({ theme }) => theme.colors.grey};
	overflow: hidden;
	white-space: nowrap;
	outline: none;
	text-overflow: ${({ editable }) => (editable ? 'clip' : 'ellipsis')};
	cursor: ${({ editable }) => (editable ? 'text' : undefined)};
	border: ${({ editable, theme }) => (editable ? `1px solid ${theme.colors.primaryLight}` : undefined)};
	border-radius: ${({ editable, theme }) => (editable ? theme.borderRadius : undefined)};
	margin: ${({ editable }) => (editable ? '0px 2px' : undefined)};
	padding: ${({ editable }) => (editable ? '2px' : undefined)};
`

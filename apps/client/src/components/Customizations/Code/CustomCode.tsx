import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror'
import { lighten } from 'polished'
import { ReactNode, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import useDebounce from '../../../hooks/useDebounce'
import { useIsHovered } from '../../../hooks/useIsHovered'
import { ExpandArrowIcon } from '../../../icons'
import { Modals } from '../../Modal'

interface Props extends ReactCodeMirrorProps {
	SectionTitle: ReactNode
	description: ReactNode
	readOnly?: boolean
	onSave: (val: string) => void
	currentValue: string
}

export const CustomCode = ({
	SectionTitle,
	description,
	placeholder,
	extensions,
	onSave,
	currentValue,
	readOnly,
}: Props) => {
	const theme = useTheme()
	const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null)
	const [val, setVal] = useState(currentValue ?? '')
	const [deBouncedValue] = useDebounce(val, 500)

	useEffect(() => {
		setVal(currentValue ?? '')
	}, [currentValue])

	useEffect(() => {
		if (deBouncedValue === currentValue) return
		onSave(deBouncedValue)
	}, [deBouncedValue])

	const isHovered = useIsHovered([parentRef]).some(Boolean)

	function onChange(v: string) {
		setVal(v)
	}

	const expandCodeEditor = () => {
		Modals.expandCodeEditor.open({ placeholder, extensions, value: val, setVal })
	}

	return (
		<FlexColumn>
			<h3>{SectionTitle}</h3>
			<Description>{description}</Description>
			<RelativeDiv ref={setParentRef}>
				<CodeMirror
					readOnly={readOnly}
					theme={tokyoNightStorm}
					placeholder={placeholder}
					height="100px"
					width="100%"
					extensions={extensions}
					basicSetup={{
						autocompletion: true,
						bracketMatching: true,
					}}
					onChange={onChange}
					value={val}
				/>
				{isHovered && (
					<FullScreenButton onClick={expandCodeEditor}>
						<ExpandArrowIcon size={12} color={theme.colors.white} />
					</FullScreenButton>
				)}
			</RelativeDiv>
		</FlexColumn>
	)
}

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	width: 100%;
`

const Description = styled.div`
	font-size: 14px;
	font-weight: 600;
`

const RelativeDiv = styled.div`
	position: relative;
`
const FullScreenButton = styled.div`
	position: absolute;
	top: 4px;
	right: 4px;
	width: 18px;
	height: 18px;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.3s ease;
	background-color: ${({ theme }) => theme.colors.greyDark};
	display: flex;
	justify-content: center;
	align-items: center;
	&:hover {
		background-color: ${({ theme }) => lighten(0.06, theme.colors.greyDark)};
	}
`

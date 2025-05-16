import { MouseEventHandler, useEffect, useRef, useState } from 'react'
import { Editor } from 'slate'
import { useSlate } from 'slate-react'
import styled, { useTheme } from 'styled-components'
import { Button } from '../Components/Button/Button'
import { Menu } from '../Components/Menu'
import { Show } from '../Components/Show'
import { setLink } from '../Leaves/Link.leaf'
import { useOnKeyPressed } from '../hooks/useOnKeyPressed'
import { useT } from '../../../../../hooks/useT'

interface ColorPickerProps {
	show: boolean
	setShow: (show: boolean) => void
	closeHoveringMenu: () => void
}

export const HoveringLinkInput = ({ show, setShow, closeHoveringMenu }: ColorPickerProps) => {
	const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
	return (
		<div>
			<RefElement ref={setReferenceElement}></RefElement>
			<Show when={show}>
				<Menu
					closing={!show}
					anchorRef={referenceElement}
					offset={[0, 25]}
					onClose={() => setShow(false)}
					placement="bottom"
					maxHeight={'360px'}
					simpleMenu={true}
				>
					<InputComponent closeHoveringMenu={closeHoveringMenu} setShow={setShow} />
				</Menu>
			</Show>
		</div>
	)
}

const RefElement = styled.div`
	width: 0px;
	height: 0px;
	background-color: transparent;
`

const InputComponent = ({
	setShow,
	closeHoveringMenu,
}: {
	setShow: (show: boolean) => void
	closeHoveringMenu: () => void
}) => {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const editor = useSlate()
	const [value, setValue] = useState<string>('')
	const { textDark } = useTheme().colors
	const [t] = useT()

	useEffect(() => {
		const [match] = Editor.nodes(editor, {
			match: (n) => 'link' in n && typeof n.link === 'string',
			universal: true,
		})

		// TODO: fix typing
		if (match && match[0]) {
			const link = match[0]?.link
			setValue(link)
		}

		setTimeout(() => inputRef.current?.focus(), 50)
	}, [])

	const formatLink = (link: string) => {
		if (link.match(/^https?:\/\//g)) {
			return link
		} else {
			return 'https://' + link
		}
	}

	const changeLink = (e?: React.MouseEvent<HTMLElement>) => {
		if (e) {
			e?.preventDefault()
			e.stopPropagation()
		}

		const value = inputRef?.current?.value
		if (value) {
			const formatedValue = formatLink(value)
			setLink(editor, formatedValue)
		}

		setShow(false)
		closeHoveringMenu()
	}

	const removeLink = (e?: React.MouseEvent<HTMLElement>) => {
		if (e) {
			e?.preventDefault()
			e.stopPropagation()
		}
		setLink(editor, '')
		setShow(false)
		closeHoveringMenu()
	}

	useOnKeyPressed('Enter', () => {
		changeLink()
	})

	useOnKeyPressed(
		'r',
		() => {
			removeLink()
		},
		{ ctrl: true }
	)

	useOnKeyPressed('Escape', () => {
		setShow(false)
	})

	const handleInputClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		e.stopPropagation()

		// so much happening with floating elements as it doesn't allow a default behavior of selection;
		// so we do a simple manual selection inside the input box
		const selection = window?.getSelection()

		if (selection) {
			inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
		}

		if (e.detail >= 2) {
			inputRef.current?.select()
		}
	}

	return (
		<Container
			onClick={() =>
				inputRef.current?.focus({
					preventScroll: true,
				})
			}
		>
			<InputWrapper>
				<Input
					ref={inputRef}
					value={value}
					onClick={handleInputClick}
					onChange={(e) => setValue(e.target.value)}
					placeholder={t('Paste link here', 'pasteLinkHere')}
				/>
			</InputWrapper>
			<Actions>
				<StyledButton color="transparent" textColor={textDark} onClick={changeLink}>
					{t('Add link', 'addLink')} <Kdb>↵</Kdb>
				</StyledButton>

				<StyledButton color="transparent" textColor={textDark} onClick={removeLink}>
					{t('Remove link', 'removeLink')} <Kdb>ctl</Kdb> + <Kdb>r</Kdb>
				</StyledButton>
			</Actions>
		</Container>
	)
}

const Kdb = styled.kbd`
	background-color: ${({ theme }) => theme.colors.lightGrey};
	border: 1px solid #ccc;
	border-radius: 4px;
	width: 20px;
	padding: 1px 3px;
`

const Actions = styled.div`
	display: flex;
	gap: 6px;
`

const StyledButton = styled(Button)`
	padding: 3px 6px;
	align-items: center;
	margin-top: 12px;
	font-size: 11px;
	height: 24px;
	border: 1px solid ${({ theme }) => theme.colors.grey};
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: baseline;
	justify-content: center;
	padding: 8px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const InputWrapper = styled.div`
	background-color: ${({ theme }) => theme.colors.primaryExtraLight};
	border-radius: ${({ theme }) => theme.borderRadius};
	width: 100%;
`

const Input = styled.input`
	padding: 6px 16px;

	${({ theme }) => theme.fonts.regular};
	font-size: 13px !important;
	color: ${({ theme }) => theme.colors.greyDark};

	&::placeholder {
		color: ${({ theme }) => theme.colors.grey};
		padding-left: 2px;
	}

	/* Reset */
	outline-style: none;
	appearance: none;
	overflow: hidden;
	background-color: transparent;
	border-radius: 0px;
	line-height: 22px;
	border: none;
	box-sizing: border-box;
	margin: 0;
	resize: none;
	width: 350px;
	max-width: 100%;
`

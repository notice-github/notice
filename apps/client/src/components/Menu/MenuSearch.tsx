import { useEffect, useRef } from 'react'
import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'input'> {}

export const MenuSearch = ({ ...props }: Props) => {
	const inputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		inputRef.current?.focus({
			preventScroll: true,
		})
	}, [])

	return (
		<Container>
			<InputWrapper>
				<Input ref={inputRef} {...props} />
			</InputWrapper>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding: 8px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
	width: 100%;
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
	overflow: hidden;
	appearance: none;
	background-color: transparent;
	border-radius: 0px;
	line-height: 22px;
	border: none;
	box-sizing: border-box;
	margin: 0;
	resize: none;
	width: 100%;
`

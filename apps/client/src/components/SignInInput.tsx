import styled from 'styled-components'
import { ChangeEventHandler, HTMLInputTypeAttribute } from 'react'

interface Props extends React.ComponentPropsWithoutRef<'input'> {
	type?: HTMLInputTypeAttribute
	placeholder?: string
	value?: string | number | readonly string[]
	onChange?: ChangeEventHandler<HTMLInputElement>
}

export const SignInInput = ({ type, placeholder, value, onChange, ...props }: Props) => {
	return (
		<InputWrapper>
			<Input value={value} onChange={onChange} type={type} placeholder={placeholder} {...props} />
		</InputWrapper>
	)
}

const InputWrapper = styled.div`
	display: flex;
	align-items: center;

	padding: 0 16px;
	border: 1px solid rgb(83, 92, 121); // TODO : add it to colors styles
	border-radius: ${({ theme }) => theme.borderRadius};

	&:focus-within {
		border-color: ${({ theme }) => theme.colors.primary};
	}
`

const Input = styled.input`
	flex: 1 1 0%;
	padding: 8px 0;

	${({ theme }) => theme.fonts.regular};
	color: ${({ theme }) => theme.colors.textLight};

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
`

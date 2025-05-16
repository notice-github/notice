import { HTMLInputTypeAttribute, ReactNode } from 'react'
import styled from 'styled-components'

import { Loader } from './Loader'
import { Show } from './Show'

interface Props extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange' | 'onBlur'> {
	type?: HTMLInputTypeAttribute
	placeholder?: string
	loader?: boolean
	value?: string | number | readonly string[]
	textColor?: string
	suffix?: ReactNode
	noSuffixBorder?: boolean
	validator?: (value: string | number | readonly string[]) => boolean
	onChange?: (value: string) => any
	onBlur?: (value: string) => any
	onEnter?: () => any
	isError?: boolean
}

export const SimpleInput = ({
	type,
	placeholder,
	loader,
	value,
	onBlur,
	onChange,
	onEnter,
	children,
	style,
	suffix,
	noSuffixBorder,
	validator,
	isError,
	...props
}: Props) => {
	return (
		<InputWrapper style={style} suffix={!!suffix} isError={isError} isValid={validator ? validator(value ?? '') : true}>
			<Input
				value={value ?? ''}
				onChange={(e) => onChange?.call(onChange, e.target.value)}
				type={type}
				placeholder={placeholder}
				onBlur={(e) => onBlur?.call(onBlur, e.target.value)}
				onKeyUp={(e) => (e.key === 'Enter' ? onEnter?.call(onEnter) : undefined)}
				{...props}
			/>
			{children}
			<Show when={loader}>
				<Loader size={16} />
			</Show>
			{suffix && <SuffixWrapper noBorder={noSuffixBorder ?? false}>{suffix}</SuffixWrapper>}
		</InputWrapper>
	)
}

const InputWrapper = styled.div<{ suffix: boolean; isValid: boolean; isError?: boolean }>`
	display: flex;
	align-items: center;

	padding: ${({ suffix }) => (suffix ? '0 0 0 16px' : '0 16px')};
	border: 1px solid ${({ theme, isValid, isError }) => (!isValid || isError ? theme.colors.error : theme.colors.border)};
	border-radius: ${({ theme }) => theme.borderRadius};

	&:focus-within {
		border-color: ${({ theme, isValid }) => (!isValid ? theme.colors.error : theme.colors.primary)};
	}
`

const Input = styled.input<Pick<Props, 'textColor'>>`
	flex: 1 1 0%;
	padding: 8px 0;

	${({ theme }) => theme.fonts.regular};
	color: ${({ theme, textColor }) => textColor ?? theme.colors.textDark};

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

const SuffixWrapper = styled.div<{ noBorder: boolean }>`
	align-self: stretch;
	overflow: hidden;
	margin-left: 12px;

	border-left: ${({ theme, noBorder }) => (noBorder ? undefined : `1px solid ${theme.colors.border}`)};
	border-top-right-radius: ${({ theme }) => theme.borderRadius};
	border-bottom-right-radius: ${({ theme }) => theme.borderRadius};
`

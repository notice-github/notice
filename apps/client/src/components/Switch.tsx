import styled, { css } from 'styled-components'

export type SwitchSizeType = 'sm' | 'md' | 'lg'
interface Props {
	value: boolean
	onChange?: (value: boolean) => any
	disabled?: boolean
	size?: SwitchSizeType
}

export const Switch = ({ value, onChange, disabled = false, size }: Props) => {
	const handleChange = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		disabled ? null : onChange?.call(onChange, !value)
	}

	return (
		<Container size={size} value={value} onClick={handleChange} disabled={disabled}>
			<Dot size={size} value={value} />
		</Container>
	)
}

const Container = styled.div<Pick<Props, 'value' | 'disabled' | 'size'>>`
	position: relative;
	width: 100%;
	background-color: ${({ theme, value }) => (value ? theme.colors.primary : theme.colors.greyLight)};
	border-radius: 90px;

	${({ size }) => {
		switch (size) {
			case 'sm':
				return css`
					max-width: 38px;
					height: 18px;
				`
			case 'md':
				return css`
					max-width: 40px;
					height: 22px;
				`
			default:
				return css`
					max-width: 44px;
					height: 26px;
				`
		}
	}};

	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const Dot = styled.div<Pick<Props, 'value' | 'size'>>`
	position: absolute;
	background-color: ${({ theme }) => theme.colors.white};

	border-radius: 360px;

	transition: left 0.25s ease;

	${({ size, value }) => {
		switch (size) {
			case 'sm':
				return css`
					width: 16px;
					height: 16px;
					top: calc(50% - (16px / 2));
					left: ${value ? 'calc(100% - 16px - 1px)' : '1px'};
				`
			case 'md':
				return css`
					width: 12px;
					height: 12px;
					top: calc(50% - (12px / 2));
					left: ${value ? 'calc(100% - 12px - 5px)' : '5px'};
				`
			default:
				return css`
					width: 16px;
					height: 16px;
					top: calc(50% - (16px / 2));
					left: ${value ? 'calc(100% - 16px - 5px)' : '5px'};
				`
		}
	}};
`

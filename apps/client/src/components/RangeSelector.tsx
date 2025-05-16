import styled, { useTheme } from 'styled-components'
import { ReactNode } from 'react'

interface Props {
	children?: ReactNode
	min: number
	max: number
	value: number
	step: number
	onChange: (value: number) => void
}

export function RangeSelector({ min, max, value, step, onChange, children }: Props) {
	return (
		<StyledInput
			type="range"
			min={min}
			max={max}
			value={value}
			step={step}
			onChange={(e) => onChange(Number(e.target.value))}
		/>
	)
}

const StyledInput = styled.input`
    width: 200px;
    
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        background: #2F4D78;
        box-shadow: 0px 0px 0px 7px rgba(221, 231, 244, 0.8);
        cursor: pointer;
    }

    -webkit-appearance: none;
    width: 80%;
    height: 7px;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.primary};
    outline: none;
    -webkit-transition: .2s;
    transition: opacity .2s;
`

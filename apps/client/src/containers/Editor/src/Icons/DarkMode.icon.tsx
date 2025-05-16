import { useState } from 'react'
import styled from 'styled-components'
import { IconProps } from '.'

export const DarkModeIcon = () => {
	const [checked, setChecked] = useState(false)
	return (
		<CenteredIconContainer>
			<input
				id="notice--theme-toggle"
				className="notice--theme-toggle"
				type="checkbox"
				checked={checked}
				onChange={(state) => setChecked(!state)}
			/>
		</CenteredIconContainer>
	)
}

const CenteredIconContainer = styled.div`
    display: flex;
	border-radius: 8px;
	background-color: var(--NTCVAR-main-bg-color);

	align-items: center;
	box-sizing: border-box;
	justify-content: center;
	height: 40px;
	width: 40px;
	transition: box-shadow 250ms;

	&:hover {
	background-color: var(--NTCVAR-lightgrey-bg-color);
    }

    .notice--theme-toggle {
        --size: 18px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        outline: none;
        width: var(--size);
        height: var(--size);
        box-shadow: inset calc(var(--size) * 0.33) calc(var(--size) * -0.25) 0;
        border-radius: 999px;
        color: ${({ theme }) => theme.colors.textDark};
        transition: all 500ms;
}

    .notice--theme-toggle:checked {
        --ray-size: calc(var(--size) * -0.4);
        --offset-orthogonal: calc(var(--size) * 0.65);
        --offset-diagonal: calc(var(--size) * 0.45);
        transform: scale(0.75);
        --color: ${({ theme }) => theme.colors.primary};
        box-shadow: inset 0 0 0 var(--size), calc(var(--offset-orthogonal) * -1) 0 0 var(--ray-size),
            var(--offset-orthogonal) 0 0 var(--ray-size), 0 calc(var(--offset-orthogonal) * -1) 0 var(--ray-size),
            0 var(--offset-orthogonal) 0 var(--ray-size),
            calc(var(--offset-diagonal) * -1) calc(var(--offset-diagonal) * -1) 0 var(--ray-size),
            var(--offset-diagonal) var(--offset-diagonal) 0 var(--ray-size),
            calc(var(--offset-diagonal) * -1) var(--offset-diagonal) 0 var(--ray-size),
            var(--offset-diagonal) calc(var(--offset-diagonal) * -1) 0 var(--ray-size);
        }

    .notice--theme-toggle {
        z-index: 1;
        }

    .notice--theme-toggle:checked ~ .background {
        /* --bg: white; */
        }

    .notice--theme-toggle:checked ~ .title {
        --color: hsl(40, 100%, 50%);
        }
    
`

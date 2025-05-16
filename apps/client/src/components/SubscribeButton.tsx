import styled from 'styled-components'

export const SubscribeButton = styled.button<{ disabled?: boolean }>`
	display: flex;
	flex-grow: 0;
	align-items: center;
	justify-content: center;

	gap: 6px;
	padding: 11px 22px;

	border: none;
	outline-style: none;

	width: auto;

	border: 1px solid rgba(0, 0, 0, 0.1);
	background: linear-gradient(92deg, #0c39d9 -7.07%, #eb6fff 83.74%);
	background-size: 400% 400%;
	transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	border-radius: ${({ theme }) => theme.borderRadius};
	animation: ${({ disabled }) => (!disabled ? 'animationGradient 7s ease infinite' : undefined)};

	font-size: 14px;
	font-weight: 700;
	color: white;
	letter-spacing: 0.7px;
	white-space: nowrap;

	filter: ${({ disabled }) => (disabled ? 'grayscale(0.5)' : undefined)};
	opacity: ${({ disabled }) => (disabled ? '0.5' : undefined)};

	cursor: ${({ disabled }) => (!disabled ? 'pointer' : 'not-allowed')};

	&:hover {
		box-shadow: ${({ disabled }) => (!disabled ? '0 2px 9px 0px rgba(0, 0, 0, 0.2)' : undefined)};
	}

	@keyframes animationGradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
`

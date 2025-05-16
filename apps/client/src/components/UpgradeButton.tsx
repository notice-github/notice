import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const UpgradeButton = styled(NavLink)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 8px;
	color: white;
	margin: auto;

	padding: 6px 12px;
	cursor: pointer;
	text-decoration: none;

	background: ${({ theme }) => theme.colors.pink};

	border-radius: 100px;
	border: 1px solid rgba(0, 0, 0, 0.1);
	background: linear-gradient(92deg, #0c39d9 -7.07%, #eb6fff 83.74%);
	background-size: 400% 400%;
	transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	animation: animationBtnGradientColor 10s ease infinite;

	font-size: 16px;
	font-weight: 600;

	&:hover {
		box-shadow: 0 2px 9px 0px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	@keyframes animationBtnGradientColor {
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

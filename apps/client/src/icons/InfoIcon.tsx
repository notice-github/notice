import { IconProps } from '.'

export const InfoIcon = ({ size = 16, color, style }: IconProps) => {
	return (
		<svg width={size} height={size} fill="none" viewBox="0 0 16 16" style={style}>
			<g clipPath="url(#InfoCircle_svg__clip0_1373_8677)" fill={color}>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M8 1.6a6.4 6.4 0 100 12.8A6.4 6.4 0 008 1.6zM.4 8a7.6 7.6 0 1115.2 0A7.6 7.6 0 01.4 8z"
				></path>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M5.4 7a.6.6 0 01.6-.6h2a.6.6 0 01.6.6v3.9H10a.6.6 0 010 1.2H6a.6.6 0 110-1.2h1.4V7.6H6a.6.6 0 01-.6-.6z"
				></path>
				<path d="M8 3.6a.9.9 0 100 1.8.9.9 0 000-1.8z"></path>
			</g>
			<defs>
				<clipPath id="InfoCircle_svg__clip0_1373_8677">
					<path fill={color} d="M0 0h16v16H0z"></path>
				</clipPath>
			</defs>
		</svg>
	)
}

import { IconProps } from '.'

export const CopyIcon = ({ size = 12, color }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet">
			<g clipPath="url(#Copy_svg__clip0_1372_9671)">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M6.5.4A2.6 2.6 0 003.9 3v.9H3A2.6 2.6 0 00.4 6.5V13A2.6 2.6 0 003 15.6h6.5a2.6 2.6 0 002.6-2.6v-.9h.9a2.6 2.6 0 002.6-2.6V3A2.6 2.6 0 0013 .4H6.5zm5.6 10.5h.9a1.4 1.4 0 001.4-1.4V3A1.4 1.4 0 0013 1.6H6.5A1.4 1.4 0 005.1 3v.9h4.4a2.6 2.6 0 012.6 2.6v4.4zM9.5 5.1a1.4 1.4 0 011.4 1.4V13a1.4 1.4 0 01-1.4 1.4H3A1.4 1.4 0 011.6 13V6.5A1.4 1.4 0 013 5.1h6.5z"
					fill={color}
				></path>
			</g>
			<defs>
				<clipPath id="Copy_svg__clip0_1372_9671">
					<path fill="#fff" d="M0 0h16v16H0z"></path>
				</clipPath>
			</defs>
		</svg>
	)
}

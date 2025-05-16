import { IconProps } from '.'

const HexIcon = ({ size = 12, color }: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path fill={color} d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"></path>
		</svg>
	)
}

export default HexIcon

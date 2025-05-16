import { IconProps } from '.'

export const ChevronIcon = ({ size = 24, color, style }: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			style={style}
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M9 18l6-6-6-6"></path>
		</svg>
	)
}

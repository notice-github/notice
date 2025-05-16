import { IconProps } from '.'

export const ArrowIcon = ({ size = 24, color }: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M19 12H5M12 19l-7-7 7-7"></path>
		</svg>
	)
}

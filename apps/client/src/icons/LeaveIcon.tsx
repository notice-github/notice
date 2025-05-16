import { IconProps } from '.'

export const LeaveIcon = ({ size = 24, color }: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
		>
			<path d="M10 22H5a2 2 0 01-2-2V4a2 2 0 012-2h5M17 16l4-4-4-4M21 12H9"></path>
		</svg>
	)
}

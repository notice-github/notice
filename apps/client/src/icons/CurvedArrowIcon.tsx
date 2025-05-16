import { IconProps } from '.'

export const CurvedArrowIcon = ({ size = 24, color }: IconProps) => {
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
			<path d="M15 14l5-5-5-5"></path>
			<path d="M4 20v-7a4 4 0 014-4h12"></path>
		</svg>
	)
}

import { IconProps } from '.'

export const ArrowLeft = ({ size = 18, color, style }: IconProps) => {
	return (
		<svg width={size} height={size} style={style} viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.424 3.576a.6.6 0 010 .848L6.85 8l3.575 3.576a.6.6 0 01-.848.848l-4-4a.6.6 0 010-.848l4-4a.6.6 0 01.848 0z"
				fill={color}
			></path>
		</svg>
	)
}

import { IconProps } from '.'

export const ArrowRight = ({ size = 18, color, style }: IconProps) => {
	return (
		<svg width={size} height={size} style={style} viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.576 3.576a.6.6 0 01.848 0l4 4a.6.6 0 010 .848l-4 4a.6.6 0 01-.848-.848L9.15 8 5.576 4.424a.6.6 0 010-.848z"
				fill={color}
			></path>
		</svg>
	)
}

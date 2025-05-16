import { IconProps } from '.'

export const DoneIcon = ({ size = 24, color, style }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
		</svg>
	)
}

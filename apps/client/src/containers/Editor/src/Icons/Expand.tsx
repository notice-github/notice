import { IconProps } from '.'

export const Expand = ({ size = 18, color, style }: IconProps) => {
	return (
		<svg width={size} height={size} style={style} viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet">
			<path
				d="M14.428 1.58A.6.6 0 0114.6 2v4a.6.6 0 11-1.2 0V3.449L9.924 6.924a.6.6 0 01-.848-.848L12.552 2.6H10a.6.6 0 010-1.2h4c.168 0 .32.069.428.18zM2 14.6h4a.6.6 0 100-1.2H3.449l3.475-3.476a.6.6 0 00-.848-.848L2.6 12.552V10a.6.6 0 10-1.2 0v4a.598.598 0 00.6.6z"
				fill={color}
			></path>
		</svg>
	)
}

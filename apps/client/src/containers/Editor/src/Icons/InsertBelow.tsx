import { IconProps } from '.'

export const InsertBelow = ({ size = 18, color, style }: IconProps) => {
	return (
		<svg viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet" width={size} height={size} style={style}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M.775 2.875a2.6 2.6 0 012.6-2.6h9a2.6 2.6 0 012.6 2.6v5.5a.6.6 0 11-1.2 0v-.9h-11.8v.9a.6.6 0 11-1.2 0v-5.5zm1.2 3.4h11.8v-3.4a1.4 1.4 0 00-1.4-1.4h-9a1.4 1.4 0 00-1.4 1.4v3.4z"
				fill={color}
			></path>
			<path
				d="M4.775 12.625a.6.6 0 00.6.6h1.9v1.9a.6.6 0 101.2 0v-1.9h1.9a.6.6 0 100-1.2h-1.9v-1.9a.6.6 0 00-1.2 0v1.9h-1.9a.6.6 0 00-.6.6zM1.375 10.025a.6.6 0 00-.6.6v1a1.6 1.6 0 001.6 1.6h.5a.6.6 0 100-1.2h-.5a.4.4 0 01-.4-.4v-1a.6.6 0 00-.6-.6zM12.875 13.225a.6.6 0 010-1.2h.5a.4.4 0 00.4-.4v-1a.6.6 0 011.2 0v1a1.6 1.6 0 01-1.6 1.6h-.5z"
				fill={color}
			></path>
		</svg>
	)
}

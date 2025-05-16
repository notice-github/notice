import { IconProps } from '.'

export const InsertAbove = ({ size = 18, color, style }: IconProps) => {
	return (
		<svg width={size} height={size} style={style} viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet">
			<path
				d="M8.475 5.875a.6.6 0 11-1.2 0v-1.9h-1.9a.6.6 0 110-1.2h1.9v-1.9a.6.6 0 011.2 0v1.9h1.9a.6.6 0 110 1.2h-1.9v1.9z"
				fill={color}
			></path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14.975 13.125a2.6 2.6 0 01-2.6 2.6h-9a2.6 2.6 0 01-2.6-2.6v-5.5a.6.6 0 111.2 0v.9h11.8v-.9a.6.6 0 011.2 0v5.5zm-1.2-3.4h-11.8v3.4a1.4 1.4 0 001.4 1.4h9a1.4 1.4 0 001.4-1.4v-3.4z"
				fill={color}
			></path>
			<path
				d="M14.375 5.975a.6.6 0 00.6-.6v-1a1.6 1.6 0 00-1.6-1.6h-.5a.6.6 0 000 1.2h.5c.22 0 .4.18.4.4v1a.6.6 0 00.6.6zM2.875 2.775a.6.6 0 110 1.2h-.5a.4.4 0 00-.4.4v1a.6.6 0 11-1.2 0v-1a1.6 1.6 0 011.6-1.6h.5z"
				fill={color}
			></path>
		</svg>
	)
}

import { IconProps } from '.'

const Cross = ({ size=14, color }: IconProps) => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill={color}
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			preserveAspectRatio="xMidYMid meet"
			data-rnwi-handle="nearest"
			style={{ verticalAlign: 'middle', width: size, height: size }}
		>
			<path d="M18 6L6 18M6 6l12 12"></path>
		</svg>
	)
}

export default Cross

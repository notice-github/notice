import { IconProps } from '.'

const Tick = ({ size = 14, color }: IconProps) => {
	return (
		<svg viewBox="0 0 16 16" fill="none" height={size} width={size} preserveAspectRatio="xMidYMid meet">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.72 11.833l8.826-8.836.708.706-9.18 9.19a.5.5 0 01-.707.001l-4.37-4.36.706-.708 4.016 4.007z"
				fill={color}
			></path>
		</svg>
	)
}

export default Tick

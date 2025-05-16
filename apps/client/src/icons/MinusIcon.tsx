import { IconProps } from '.'

const MinusIcon = ({ size = 14, color }: IconProps) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" version="1.1" fill={color} width={size} height={size} viewBox="0 0 256 256">
			<defs></defs>
			<g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
				<path
					d="M 86.5 48.5 h -83 C 1.567 48.5 0 46.933 0 45 s 1.567 -3.5 3.5 -3.5 h 83 c 1.933 0 3.5 1.567 3.5 3.5 S 88.433 48.5 86.5 48.5 z"
					transform=" matrix(1 0 0 1 0 0) "
					strokeLinecap="round"
				/>
				<path
					d="M 86.5 48.5 h -83 C 1.567 48.5 0 46.933 0 45 s 1.567 -3.5 3.5 -3.5 h 83 c 1.933 0 3.5 1.567 3.5 3.5 S 88.433 48.5 86.5 48.5 z"
					transform=" matrix(1 0 0 1 0 0) "
					strokeLinecap="round"
				/>
			</g>
		</svg>
	)
}

export default MinusIcon

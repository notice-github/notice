import { IconProps } from '.'

export const TemplateIcon = ({ size = 16, color }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 16 16">
			<path
				d="M14.5 16h-13a.5.5 0 01-.5-.5V.5a.5.5 0 01.5-.5h13a.5.5 0 01.5.5v15a.5.5 0 01-.5.5zM2 15h12V1H2v14z"
				fill={color}
			></path>
			<path d="M13 2H3v1h10V2zM13 13H3v1h10v-1z" fill={color}></path>
		</svg>
	)
}

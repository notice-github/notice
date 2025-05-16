import { IconProps } from '.'

export const PlusIcon = ({ size = 16, color }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 1024 1024">
			<path
				d="M836 476H548V188c0-19.8-16.2-36-36-36s-36 16.2-36 36v288H188c-19.8 0-36 16.2-36 36s16.2 36 36 36h288v288c0 19.8 16.2 36 36 36s36-16.2 36-36V548h288c19.8 0 36-16.2 36-36s-16.2-36-36-36z"
				fill={color}
			/>
		</svg>
	)
}

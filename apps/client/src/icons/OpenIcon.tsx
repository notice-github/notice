import { IconProps } from '.'

export const OpenIcon = ({ size = 18, color, style }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
			<path
				d="M8.07642 9.9236L17 1M17 1V5.36265M17 1H12.6374"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.59766 2.83871H3.99152C2.33466 2.83871 0.991516 4.18186 0.991516 5.83872V14.0085C0.991516 15.6653 2.33466 17.0085 3.99152 17.0085H12.1613C13.8182 17.0085 15.1613 15.6653 15.1613 14.0085V8.40238H13.1613V14.0085C13.1613 14.5608 12.7136 15.0085 12.1613 15.0085H3.99152C3.43923 15.0085 2.99152 14.5608 2.99152 14.0085V5.83872C2.99152 5.28643 3.43923 4.83871 3.99152 4.83871H9.59766V2.83871Z"
				fill={color}
			/>
		</svg>
	)
}

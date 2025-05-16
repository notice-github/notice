import { css, FlattenSimpleInterpolation } from 'styled-components'

export const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'

interface Fonts {
	regular: FlattenSimpleInterpolation
	editor: FlattenSimpleInterpolation
}

export const fonts: Fonts = {
	regular: css`
		font-family: ${FONT};
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 1.4;
	`,
	editor: css`
		font-family: var(--ntc-user-font-family), ${FONT};
		color: var(--ntc-user-font-color);
		font-size: var(--ntc-user-font-size);
		line-height: var(--ntc-user-line-height);
		letter-spacing: var(--ntc-user-letter-spacing);
	`,
}

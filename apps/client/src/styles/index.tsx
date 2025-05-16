import React from 'react'
import { ThemeProvider } from 'styled-components'

import { colors } from './colors'
import { fonts } from './fonts'

export const customTheme = {
	zIndex: {
		tooltip: 2147483647,
		hoveringBars: 2147483646,
		toast: 2147483645,
		menu: 2147483644,
		modal: 2147483643,
	},
	modalMargin: '40px',
	borderRadius: '6px',
	colors,
	fonts,
}

type CustomTheme = typeof customTheme
declare module 'styled-components' {
	export interface DefaultTheme extends CustomTheme {}
}

interface Props {
	children: React.ReactNode
}

export const NThemeProvider = ({ children }: Props) => {
	return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>
}

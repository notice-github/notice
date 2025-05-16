import { QueryClientProvider } from '@tanstack/react-query'
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'

import { GlobalToastContainer } from './components/Toast/GloablToastContainer'
import { SmallWidthDetector } from './components/smallWidthDetector'
import { useDuplicatedNoticeTab } from './hooks/useDuplicatedNoticeTab'
import { Router } from './router'
import { NThemeProvider } from './styles'
import { Analytics, queryClient } from './utils/query'
import { LangProvider } from './internationalisation/i18n.provider'

/**
 * RESET CSS
 */
const ResetCSS = createGlobalStyle`
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed,
	figure, figcaption, footer, header, hgroup,
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		vertical-align: baseline;
	}

	article, aside, details, figcaption, figure,
	footer, header, hgroup, menu, nav, section {
		display: block;
	}

	body {
		line-height: 1;
	}

	ol, ul {
		/* list-style: none; */
	}

	blockquote, q {
		quotes: none;
	}

	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;
	}
`

const GlobalTheme = createGlobalStyle`
	html, body {
		background-color: ${(props) => props.theme.colors.white};
		color: ${({ theme }) => theme.colors.textDark};
		overscroll-behavior: none;
		${(props) => props.theme.fonts.regular}

	}

	:root {
		font-size: 16px;
	}
`

const ReactQueryDevtools = React.lazy(() =>
	import('@tanstack/react-query-devtools').then((d) => ({
		default: d.ReactQueryDevtools,
	}))
)

export const NoticeApp = () => {
	useDuplicatedNoticeTab() // hook to check for duplicate notice tabs

	return (
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<AppErrorBoundary>
					<NThemeProvider>
						<LangProvider>
							<SmallWidthDetector />
							<ResetCSS />
							<GlobalTheme />
							<GlobalToastContainer />
							{/* <Migration /> */}
							<RouterProvider router={Router._router} />
						</LangProvider>
					</NThemeProvider>
				</AppErrorBoundary>
				{process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />}
			</QueryClientProvider>
		</React.StrictMode>
	)
}

const Migration = () => {
	return (
		<article
			style={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div style={{ marginBottom: 64 }}>
				<h1 style={{ fontSize: 64, marginBottom: 16 }}>We are under maintenance</h1>
				<div>
					<p style={{ fontSize: 22 }}>
						Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment.
						<br />
						We&rsquo;ll be back soon!
					</p>
					<p style={{ fontSize: 18, marginTop: 16 }}>&mdash; The Notice Team</p>
				</div>
			</div>
		</article>
	)
}

class AppErrorBoundary extends Component<{ children?: ReactNode }, { hasError: boolean }> {
	public state = {
		hasError: false,
	}

	public static getDerivedStateFromError(_: Error) {
		return { hasError: true }
	}

	public componentDidCatch(error: Error, info: ErrorInfo) {
		Analytics.post('/tracker/crash', {
			name: error.name,
			message: error.message,
			stack: error.stack,
			metadata: { url: window.location.href },
		})
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<img
						style={{ width: 'calc(100% - 64px)', maxWidth: '800px', margin: '0 32px' }}
						src="/assets/images/error-boundary.png"
					/>
				</div>
			)
		}

		return this.props.children
	}
}

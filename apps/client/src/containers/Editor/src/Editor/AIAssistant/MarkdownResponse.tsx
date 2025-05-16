import styled from 'styled-components'
import { marked } from 'marked'

interface Props {
	markdown: string
}
export const MarkdownResponse = ({ markdown }: Props) => {
	return (
		<Wrapper
			dangerouslySetInnerHTML={{
				__html: markdown
					? marked(markdown, {
							silent: true,
							breaks: true,
					  })
					: '',
			}}
		></Wrapper>
	)
}

const Wrapper = styled.div`
	padding: 12px 24px 10px 10px;
	font-family: system-ui;
	font-size: 15px;
	line-height: 1.4;
	p {
		${(props) => props.theme.fonts.editor}

		margin: 0;
		cursor: text;

		max-width: 100%;
		width: 100%;
		white-space: pre-wrap;
		word-break: break-word;
		caret-color: var(--ntc-user-font-color);
		padding: 0;
		line-height: var(--ntc-user-p-line-height);
		font-weight: 400;
	}
	ol {
		list-style: decimal;
		padding-left: 16px;
		padding-top: var(--ntc-user-block-padding);
		padding-bottom: var(--ntc-user-block-padding);

		margin-left: 12px;
		color: var(--ntc-user-font-color);
	}
	ul {
		padding-left: 16px;
		padding-top: var(--ntc-user-block-padding);
		padding-bottom: var(--ntc-user-block-padding);

		margin-left: 12px;
		color: var(--ntc-user-font-color);
	}
	li {
		padding-left: 0px;
		color: var(--ntc-user-font-color);
	}
	p {
		padding: 0;
		margin: 0;
	}
	h1 {
		padding: 0;
		span {
			font-size: var(--ntc-user-h1-size);
			font-weight: var(--ntc-user-h1-weight);
		}
	}
	h2 {
		padding: 0;
		span {
			font-size: var(--ntc-user-h2-size);
			font-weight: var(--ntc-user-h2-weight);
		}
	}
	h3 {
		padding: 0;
		span {
			font-size: var(--ntc-user-h3-size);
			padding: var(--ntc-user-headings-padding);
			font-weight: var(--ntc-user-h3-weight);
		}
	}
`

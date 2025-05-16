import { CodeHighlighter } from '../../components/CodeHighlighter'

const NoticeScript = () => {
	const Script = `<script defer="defer" charset="UTF-8"
src="https://bundle.notice.studio/index.js"></script>`

	return <CodeHighlighter code={Script} />
}

export default NoticeScript

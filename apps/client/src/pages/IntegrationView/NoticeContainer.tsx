import { CodeHighlighter } from '../../components/CodeHighlighter'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'

interface Props {
	integrationType?: string
}

const NoticeContainer = ({ integrationType }: Props) => {
	const [page] = useCurrentPage()

	const NoticeDiv = `<div
class="notice-target-container" notice-integration="${integrationType}"
project-id="${page?.rootId}">
</div>`

	return <CodeHighlighter code={NoticeDiv} />
}

export default NoticeContainer

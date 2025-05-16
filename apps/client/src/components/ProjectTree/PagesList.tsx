import { PageModel } from '@notice-app/models'

import { useActivePages } from '../../hooks/bms/page/useActivePages'
import { PageItem } from './PageItem'
import { ProjectTreeThemeType } from './ProjectTree'

interface Props {
	page: PageModel.graph
	depth: number
	readOnly?: boolean
	theme?: ProjectTreeThemeType
	projectIsDragged?: boolean
	parentIsDragging?: boolean
}

export const PagesList = ({ page, depth, theme, readOnly = false, projectIsDragged, parentIsDragging }: Props) => {
	const activePages = useActivePages()

	return page.subpages.map((subP) => {
		return (
			<PageItem
				key={subP.id}
				id={subP.id}
				parent={page}
				page={subP}
				active={activePages.find((p) => p.id === subP.id) != null}
				depth={depth + 1}
				readOnly={readOnly}
				theme={theme}
				projectIsDragged={projectIsDragged}
				parentIsDragging={parentIsDragging}
			/>
		)
	})
}

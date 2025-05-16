import { useState } from 'react'

import { Menu } from '../../components/Menu'
import { MenuItem } from '../../components/Menu/MenuItem'
import { Modals } from '../../components/Modal'
import { useTrackEvent } from '../../hooks/analytics/useTrackEvent'
import { useUser } from '../../hooks/api/useUser'
import { useCreatePage } from '../../hooks/bms/page/useCreatePage'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'

import { PageModel } from '@notice-app/models'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useT } from '../../hooks/useT'
import { AllTemplateIcon, RawPageIcon } from '../../icons/ProjectIcons'

interface Props<T> {
	// Menu
	anchorRef: T | null
	onClose?: () => any
}

export const AddButtonMenu = <T extends HTMLElement>({ anchorRef, onClose }: Props<T>) => {
	const [closing, setClosing] = useState(false)
	const [t] = useT()

	const [currentPage, setCurrentPage] = useCurrentPage()
	const createPage = useCreatePage()
	const [project] = useCurrentProject()

	const user = useUser()

	const onNewProject = () => {
		Modals.projectSelector.open()
		setClosing(true)
	}

	const onNewPage = async () => {
		if (createPage.isLoading || !currentPage) return
		const newPage = await createPage.mutateAsync({
			name: '',
			parent: project as PageModel.node,
		})
		setCurrentPage(newPage)
		setClosing(true)
	}

	return (
		<Menu closing={closing} placement="top" anchorRef={anchorRef} offset={[0, 8]} maxWidth="215px" onClose={onClose}>
			<MenuItem
				icon={<AllTemplateIcon size={18} />}
				text={t('New Project', 'newProject')}
				hint={t('Create a new project', 'createNewProject')}
				onClick={onNewProject}
			/>
			<MenuItem
				icon={<RawPageIcon size={18} />}
				text={t('New Page', 'newPage')}
				hint={t('Add a new page inside the current project', 'addNewPage')}
				onClick={onNewPage}
				loading={createPage.isLoading}
			/>
		</Menu>
	)
}

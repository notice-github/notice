import { useState } from 'react'

import { BlockModel } from '@notice-app/models'
import { NUrls } from '@notice-app/utils'
import { Menu } from '../../components/Menu'
import { MenuItem } from '../../components/Menu/MenuItem'
import { Modals } from '../../components/Modal'
import { Show } from '../../components/Show'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useDuplicateProject } from '../../hooks/bms/project/useDuplicateProject'
import { usePublish } from '../../hooks/bms/usePublish'
import { invalidatePublishState, usePublishState } from '../../hooks/bms/usePublishState'
import { useT } from '../../hooks/useT'
import { EditIcon } from '../../icons/EditIcon'
import { ExportIcon } from '../../icons/ExportIcon'
import { TrashIcon } from '../../icons/TrashIcon'
import { downloadAsFile } from '../../utils/file'
import { BMS } from '../../utils/query'
import { DuplicateIcon } from '../../icons/DuplicateIcon'

interface Props<T> {
	// Menu
	anchorRef: T | null
	limited?: boolean
	onClose?: () => any

	// Data
	project: BlockModel.block
	onRename?: () => any
}

export const ProjectMenu = <T extends HTMLElement>({
	project,
	limited = false,
	anchorRef,
	onClose,
	onRename,
}: Props<T>) => {
	const [closing, setClosing] = useState(false)
	const [t] = useT()

	const [workspace] = useCurrentWorkspace()
	const publish = usePublish()
	const publishState = usePublishState()
	const [loading, setLoading] = useState(false)
	const duplicateProject = useDuplicateProject()

	const onDuplicate = async () => {
		await duplicateProject.mutateAsync({ project, workspace })
		setClosing(true)
	}

	const onExportJSON = async () => {
		if (loading) return

		setLoading(true)
		try {
			const { data } = await BMS.get(`/blocks/${project.id}/graph`)
			const filename = (data.data.data.text as string).toLocaleLowerCase().normalize('NFD').replace(/ /g, '-')
			downloadAsFile(JSON.stringify(data.data, null, 2), 'application/json', `${filename}.json`)
			setClosing(true)
		} finally {
			setLoading(false)
		}
	}

	const onExportMD = async () => {
		if (publishState.data !== 'up_to_date' && project != null) {
			await publish.mutateAsync({ block: project })
			await invalidatePublishState(project.id)
		}

		const markdown = await fetch(`${NUrls.App.bdn()}/document/${project.id}?format=markdown`).then((res) => res.text())
		downloadAsFile(markdown, 'text/plain', `${project.data.text ?? project?.preferences?.projectTitle}.md`)
		setClosing(true)
	}

	const onDelete = () => {
		Modals.deleteProjectConfirmation.open({ project })
		setClosing(true)
	}

	return (
		<Menu closing={closing} anchorRef={anchorRef} offset={[0, 4]} onClose={onClose}>
			<Show when={onRename != null && !limited}>
				<MenuItem
					icon={<EditIcon size={18} />}
					text={t('Rename', 'rename')}
					onClick={() => {
						onRename!()
						setClosing(true)
					}}
				/>
			</Show>
			<Show when={!limited}>
				<MenuItem icon={<DuplicateIcon size={18} />} text={t('Duplicate', 'duplicate')} onClick={onDuplicate} />
			</Show>
			<MenuItem icon={<ExportIcon size={18} />} text={t('Export JSON', 'exportJSON')} onClick={onExportJSON} />
			<MenuItem
				icon={<ExportIcon size={18} />}
				text={t('Export Markdown', 'exportMarkdown')}
				onClick={onExportMD}
				loading={loading}
			/>
			<Show when={!limited}>
				<MenuItem icon={<TrashIcon size={18} />} text={t('Delete', 'delete')} onClick={onDelete} />
			</Show>
		</Menu>
	)
}

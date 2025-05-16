import { useState } from 'react'

import { BlockModel, PageModel } from '@notice-app/models'
import { NUrls } from '@notice-app/utils'
import { Menu } from '../../components/Menu'
import { MenuItem } from '../../components/Menu/MenuItem'
import { Modals } from '../../components/Modal'
import { Show } from '../../components/Show'
import { usePublish } from '../../hooks/bms/usePublish'
import { invalidatePublishState, usePublishState } from '../../hooks/bms/usePublishState'
import { useT } from '../../hooks/useT'
import { EditIcon } from '../../icons/EditIcon'
import { ExportIcon } from '../../icons/ExportIcon'
import { TrashIcon } from '../../icons/TrashIcon'
import { ZapIcon } from '../../icons/ZapIcon'
import { downloadAsFile } from '../../utils/file'

interface Props<T> {
	// Menu
	anchorRef: T | null
	onClose?: () => any

	// Data
	page: PageModel.node
	onRename?: () => any
	block?: BlockModel.block
}

export const PageMenu = <T extends HTMLElement>({ page, anchorRef, onClose, onRename, block }: Props<T>) => {
	const [t] = useT()
	const [closing, setClosing] = useState(false)
	const publish = usePublish()
	const publishState = usePublishState()
	const [loading, setLoading] = useState(false)

	const onDelete = async () => {
		Modals.deletePageConfirmation.open({ page })
		setClosing(true)
	}

	const onExportMD = async () => {
		if (loading) return

		setLoading(true)
		try {
			if (publishState.data !== 'up_to_date' && block != null) {
				await publish.mutateAsync({ block: block })
				await invalidatePublishState(block.id)
			}

			const markdown = await fetch(`${NUrls.App.bdn()}/document/${page.id}?format=markdown`).then((res) => res.text())
			downloadAsFile(markdown, 'text/plain', `${block?.data?.text}.md`)
			setClosing(true)
		} finally {
			setLoading(false)
		}
	}

	const onMetadata = () => {
		if (!block) return
		Modals.pageMetadata.open({ page: block })
		setClosing(true)
	}

	return (
		<Menu scrollable={false} closing={closing} anchorRef={anchorRef} offset={[0, 4]} onClose={onClose}>
			<Show when={onRename != null}>
				<MenuItem
					icon={<EditIcon size={18} />}
					text={t('Rename', 'rename')}
					onClick={() => {
						onRename!()
						setClosing(true)
					}}
				/>
			</Show>
			<MenuItem icon={<ZapIcon size={18} />} text={t('Metadata', 'metadata')} onClick={onMetadata} />

			{/* <MenuItem
				icon={<DuplicateIcon size={18} />}
				text={t('Duplicate', 'duplicate')}
				onClick={onDuplicate}
				loading={duplicatePage.isLoading}
			/> */}
			<MenuItem icon={<ExportIcon size={18} />} text={t('Export Markdown', 'exportMarkdown')} onClick={onExportMD} loading={loading} />
			<MenuItem icon={<TrashIcon size={18} />} text={t('Delete', 'delete')} onClick={onDelete} />
		</Menu>
	)
}

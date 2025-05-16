import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'

import { FileModel } from '@notice-app/models'
import { toast } from 'react-toastify'
import { Loader } from '../Loader'
import { Show } from '../Show'

export interface ICropperRefContainer {
	name: string
	picture: string | null
	size?: number
	editable?: boolean
	source?: FileModel.source
	onSave?: (url: string | null) => void
	setMenuOpened: Dispatch<SetStateAction<boolean>>
	setSelectedFile: Dispatch<SetStateAction<string | null>>
}

const getInitials = (name: string) => {
	try {
		return (name.match(/[\w\d]+/g) ?? [])
			.map((part) => part.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('')
	} catch {
		return 'AA'
	}
}

export const CropperRefContainer = ({
	name,
	size = 48,
	picture,
	editable = true,
	setMenuOpened,
	setSelectedFile,
}: ICropperRefContainer) => {
	const [loading, setLoading] = useState(false)
	const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		setLoading(true)

		if (e.target.files && e.target.files[0]) {
			// keep the file limit to 1mb as cropper struggles to handle large image files
			if (e.target.files[0].size > 1 * 1_048_576) {
				toast.error('File size too big, Must be under 1MB.')
				setLoading(false)
			} else {
				const url = URL.createObjectURL(e.target.files[0])
				setSelectedFile(url)
				setMenuOpened(true)
				setLoading(false)
			}
		}
	}

	return (
		<Container size={size}>
			<Show when={picture == null}>
				<Background size={size}>{getInitials(name)}</Background>
			</Show>
			<Show when={picture != null}>
				<Picture src={picture!} />
			</Show>
			<Show when={editable}>
				<FileInput
					onClick={(e) => (e.currentTarget.value = '')} // reset the selection on every click
					type="file"
					onChange={onFileChange}
					accept="image/png,image/jpeg"
				/>
			</Show>
			<Show when={loading}>
				<LoaderBackground>
					<Loader size={20} color="white" />
				</LoaderBackground>
			</Show>
		</Container>
	)
}

const Container = styled.div<{ size: number }>`
	position: relative;
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.lightGrey};
	overflow: hidden;
`

const FileInput = styled.input`
	position: absolute;
	width: 100%;
	height: 100%;
	opacity: 0;

	cursor: pointer;

	&::file-selector-button {
		display: none;
	}
`

const Picture = styled.img`
	position: absolute;
	width: 100%;
	height: 100%;
	object-fit: cover;
`

const Background = styled.div<{ size: number }>`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.colors.primary};
	font-size: ${({ size }) => Math.round(size / 2.2)}px;
	color: ${({ theme }) => theme.colors.white};
`

const LoaderBackground = styled.div`
	width: 100%;
	height: 100%;

	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.5);

	position: absolute;
`

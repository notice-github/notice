import { FileModel } from '@notice-app/models'
import { useEffect, useReducer } from 'react'

import { EventEmitter } from '../../utils/events'
import { Uploader } from '../Uploader'
import { DrawerContainer } from './DrawerContainer'

const emitter = new EventEmitter()

class DrawerContext<T = void> {
	public opened = false

	private _closing = false

	private name: string
	private builder: (props: T) => JSX.Element

	private props?: T = undefined

	constructor(name: string, builder: (props: T) => JSX.Element) {
		this.name = name
		this.builder = builder
	}

	public open(props: T) {
		this.opened = true
		this.props = props
		emitter.dispatch('update', this.name)
	}

	public close() {
		this._closing = true
		emitter.dispatch('update', this.name)
	}

	private _close() {
		this.opened = false
		this._closing = false
		this.props = undefined
		emitter.dispatch('update', this.name)
	}

	public render() {
		if (!this.opened) return

		return (
			<DrawerContainer key={this.name} opened={this._closing ? false : this.opened} onClose={() => this._close()}>
				{this.builder(this.props!)}
			</DrawerContainer>
		)
	}
}

export const Drawers = {
	imageUploader: new DrawerContext<{ onSelected: (file: FileModel.client) => any }>(
		'imageUploader',
		({ onSelected }) => (
			<Uploader
				acceptedTypes={['image/png', 'image/svg+xml', 'image/jpeg', 'image/gif']}
				mimeTypes={['png', 'svg', 'jpeg', 'gif']}
				uploaderType="imageUploader"
				type={'image'}
				iconType="image"
				translationkey={'selectAnImage'}
				onSelected={onSelected}
			/>
		)
	),
	documentUploader: new DrawerContext<{ onSelected: (file: FileModel.client) => any }>(
		'documentUploader',
		({ onSelected }) => (
			<Uploader
				acceptedTypes={['*']}
				mimeTypes={['*']}
				uploaderType="documentUploader"
				type={'application'}
				iconType="file-icon"
				translationkey={'selectADocument'}
				onSelected={onSelected}
			/>
		)
	),
	videoUploader: new DrawerContext<{ onSelected: (file: FileModel.client) => any }>(
		'videoUploader',
		({ onSelected }) => (
			<Uploader
				acceptedTypes={['video/mp4', 'video/WebM', 'video/Ogg']}
				mimeTypes={['mp4', 'ogg', 'webm']}
				uploaderType="videoUploader"
				type={'video'}
				iconType="video-icon"
				translationkey={'selectAVideo'}
				onSelected={onSelected}
			/>
		)
	),
	audioUploader: new DrawerContext<{ onSelected: (file: FileModel.client) => any }>(
		'audioUploader',
		({ onSelected }) => (
			<Uploader
				acceptedTypes={['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/midi']}
				mimeTypes={['mp3', 'wav', 'ogg', 'midi']}
				uploaderType="audioUploader"
				type={'audio'}
				iconType="audio-icon"
				translationkey={'selectAnaudio'}
				onSelected={onSelected}
			/>
		)
	),
}

export const GlobalDrawerContainer = () => {
	const [_, forceUpdate] = useReducer((x) => x + 1, 0)

	const onUpdate = () => forceUpdate()

	useEffect(() => {
		emitter.subscribe('update', onUpdate)

		return () => {
			emitter.unsubscribe('update', onUpdate)
		}
	}, [])

	return Object.values(Drawers)
		.map((drawer) => drawer.render())
		.filter((elem) => elem !== undefined)
}

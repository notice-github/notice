export const getImageDimensions = (file: File | string): Promise<{ width: number; height: number }> => {
	return new Promise((resolve, reject) => {
		const img = document.createElement('img')

		img.onload = () => resolve({ width: img.width, height: img.height })
		img.onerror = () => reject(new Error('could not load the image'))

		img.src = typeof file === 'string' ? file : URL.createObjectURL(file)
	})
}

export const getVideoDimensions = (file: File | string): Promise<{ width: number; height: number }> => {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video')

		video.addEventListener(
			'loadedmetadata',
			() => resolve({ width: video.videoWidth, height: video.videoHeight }),
			false
		)

		video.src = typeof file === 'string' ? file : URL.createObjectURL(file)
	})
}

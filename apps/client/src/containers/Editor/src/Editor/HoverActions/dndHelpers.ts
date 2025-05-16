export const createGhostDiv = () => {
	const elem = document.createElement('div')
	elem.id = 'drag-ghost'
	elem.style.backgroundColor = '#3a83cf'
	elem.style.width = '100px'
	elem.style.height = '50px'
	elem.style.position = 'absolute'
	elem.style.borderRadius = '8px'
	elem.innerHTML = 'Move block'
	elem.style.fontWeight = '600'
	elem.style.color = 'white'
	elem.style.display = 'flex'
	elem.style.alignItems = 'center'
	elem.style.justifyContent = 'center'
	document.body.appendChild(elem)
	return elem
}

export const cleanGhostDiv = () => {
	const elem = document.getElementById('drag-ghost')
	if (elem) {
		document.body.removeChild(elem)
	}
}

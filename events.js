export const context = {
	autoRotate: true,
}

export const initEvents = (raycaster, pointer, camera, earth) => {
	window.onpointerdown = (e) => {
		pointer.x = (e.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(e.clientY / window.innerHeight) * 2 + 1

		raycaster.setFromCamera(pointer, camera)

		const intersect = raycaster.intersectObject(earth)[0]

		console.log(intersect.point)
	}
}

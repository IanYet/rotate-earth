import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { context, initEvents } from './events'
import './style.css'
import * as THREE from 'three'

async function main() {
	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	)

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	})
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.querySelector('#app').appendChild(renderer.domElement)

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enablePan = false
	controls.enableDamping = true
	controls.rotateSpeed = 0.5
	controls.maxDistance = 10
	controls.minDistance = 1.3

	const geometry = new THREE.SphereGeometry(1, 64, 32)
	const material = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('/map.jpg'),
	})
	const earth = new THREE.Mesh(geometry, material)
	scene.add(earth)

	camera.position.z = 3
	controls.update()

	addPOI(scene)

	function animate() {
		if (context.autoRotate) {
			earth.rotation.y += 0.005
		}

		renderer.render(scene, camera)
	}
	renderer.setAnimationLoop(animate)

	window.onresize = () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	}

	const raycaster = new THREE.Raycaster()
	const pointer = new THREE.Vector2()
	initEvents(raycaster, pointer, camera, earth)
}

function addPOI(scene) {
	const positions = [
		new THREE.Vector3(0.691137466274726, 0.6134273059838669, 0.3789158184759951),
		new THREE.Vector3(0.7643348581050543, 0.5015856021101729, 0.4019030981965387),
		new THREE.Vector3(0.7498077097709449, 0.3871428563024152, 0.5345127384629131),
		new THREE.Vector3(0.6181591209540274, 0.6465117657744468, 0.4441820441569559),
		new THREE.Vector3(0.6914231846692015, 0.4995829759525572, 0.5180949797282761),
	]

	for (let pos of positions) {
		const geo = new THREE.ConeGeometry(0.01, 0.04, 3, 1, true)
		const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
		const poi = new THREE.Mesh(geo, mat)
		poi.position.copy(pos.add(new THREE.Vector3(0, 0.02, 0)))
		poi.rotateX(Math.PI)

		scene.add(poi)
	}
}

main()

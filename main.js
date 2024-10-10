import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { context, initEvents } from './events'
import './style.css'
import * as THREE from 'three'
import { CanvasTexture } from 'three'
import { Sprite } from 'three'
import { SpriteMaterial } from 'three'

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
	controls.autoRotate = true
	controls.enableDamping = true
	controls.rotateSpeed = 0.5
	controls.maxDistance = 10
	controls.minDistance = 1.3

	const geometry = new THREE.SphereGeometry(1, 64, 32)
	const map = new THREE.TextureLoader().load('/map2.jpg')
	map.anisotropy = 16
	const material = new THREE.MeshBasicMaterial({
		map,
	})
	const earth = new THREE.Mesh(geometry, material)
	earth.rotateY(-10*Math.PI/12)
	scene.add(earth)

	camera.position.z = 2
	camera.position.y = 1
	controls.update()

	addPOI(scene)

	function animate() {
		if (context.autoRotate) {
			controls.update()
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
	]

	for (let pos of positions) {
		const geo = new THREE.ConeGeometry(0.01, 0.04, 3, 1, true)
		const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
		const poi = new THREE.Mesh(geo, mat)

		const cav = new OffscreenCanvas(2048,2048)
		const ctx = cav.getContext('2d')
		ctx.fillStyle = 'black'
		ctx.strokeStyle = 'black'
		ctx.font = '256px sans-serif'
		ctx.fillText('永红机械集团厂', 0,512)
		const map = new CanvasTexture(cav)
		const sprite = new Sprite(new SpriteMaterial({map}))
		sprite.scale.set(0.2,0.2,0.2)
		sprite.center.set(1,0.5)


		poi.position.copy(pos.clone().add(new THREE.Vector3(0, 0.02, 0)))
		sprite.position.copy(pos.clone().multiplyScalar(1.05))
		poi.rotateX(Math.PI)

		scene.add(poi)
		scene.add(sprite)
	}
}

main()

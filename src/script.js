import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import islandVertexShader from './shaders/island/vertex.glsl'
import GUI from 'lil-gui'
import islandFragmentShader from './shaders/island/fragment.glsl'


const gui = new GUI({ width: 340 })
const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 12)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor('#181818')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.shadowMap.enabled = true;


const vertexCount = 512

const islandImage = textureLoader.load(`./kapiti-${vertexCount}.png`);
/**
 * Particles
 */
const islandGeometry = new THREE.PlaneGeometry(10, 10, vertexCount, vertexCount)

const islandMaterial = new THREE.ShaderMaterial({
    vertexShader: islandVertexShader,
    fragmentShader: islandFragmentShader,
    //wireframe: true,
    uniforms:
    {
        uMap: new THREE.Uniform(islandImage),
        uSunPositionX: new THREE.Uniform(3),
        uSunPositionY: new THREE.Uniform(4),
        uSunPositionZ: new THREE.Uniform(-4),
        uTexelSizeX: new THREE.Uniform(new THREE.Vector2(1.0 / vertexCount, 1.0 / vertexCount)),
        uDisplacementScale: new THREE.Uniform(1.0)
    }
})
const island = new THREE.Mesh(islandGeometry, islandMaterial)    
island.rotation.x = - Math.PI * 0.5                                                                                                 
scene.add(island)

gui.add(islandMaterial.uniforms.uSunPositionX, 'value').min(-20).max(20).step(0.1).name('sunPositionX')
gui.add(islandMaterial.uniforms.uSunPositionY, 'value').min(-20).max(20).step(0.1).name('sunPositionY')
gui.add(islandMaterial.uniforms.uSunPositionZ, 'value').min(-20).max(20).step(0.1).name('sunPositionZ')
gui.add(islandMaterial.uniforms.uDisplacementScale, 'value').min(0).max(2.0).step(0.001).name('uDisplacementScale')


/**
 * Light helpders
 */
// const directionalLightHelper = new THREE.Mesh(
//     new THREE.PlaneGeometry(),
//     new THREE.MeshBasicMaterial()
// )

// directionalLightHelper.material.color.setRGB(0.1, 0.1, 1.0)
// directionalLightHelper.material.side = THREE.DoubleSide
// scene.add(directionalLightHelper)

const directionalLight = new THREE.DirectionalLight(new THREE.Color('#FFFFFF'), 1.0)
directionalLight.position.set(1, 0.25, 0)
directionalLight.castShadow = true;
scene.add(directionalLight)
/**
 * Animate                                                                                                                                                                                          
 */
const tick = () =>
{
    // Update controls
    controls.update()

    directionalLight.position.set(islandMaterial.uniforms.uSunPositionX.value, islandMaterial.uniforms.uSunPositionY.value, islandMaterial.uniforms.uSunPositionZ.value)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
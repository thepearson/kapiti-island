import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import islandVertexShader from './shaders/island/vertex.glsl'
import islandFragmentShader from './shaders/island/fragment.glsl'
import oceanVertexShader from './shaders/ocean/vertex.glsl'
import oceanFragmentShader from './shaders/ocean/fragment.glsl'

const gui = new GUI({ width: 340 })
const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
scene.fog = new THREE.Fog( 0x9bd8ff, 50, 60);

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
camera.position.set(6, 1, 14)
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
renderer.setClearColor('#9bd8ff')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.shadowMap.enabled = true;


const vertexCount = 1024

const islandImage = textureLoader.load(`./kapiti-${vertexCount}.png`);
const islandColorImage = textureLoader.load(`./kapiti-img-${vertexCount}.png`);


/**
 * Island
 */
const islandGeometry = new THREE.PlaneGeometry(10, 10, vertexCount, vertexCount)

const islandMaterial = new THREE.ShaderMaterial({
    vertexShader: islandVertexShader,
    fragmentShader: islandFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    //fog: true,
    //wireframe: true,
    uniforms:
    {
        uMap: new THREE.Uniform(islandImage),
        uColor: new THREE.Uniform(islandColorImage),
        uSunPositionX: new THREE.Uniform(0),
        uSunPositionY: new THREE.Uniform(10),
        uSunPositionZ: new THREE.Uniform(0),
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
 * Ocean
 */

// Color
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'

const oceanGeometryLarge = new THREE.PlaneGeometry(5000, 5000, 4, 4)
const oceanMaterialLarge = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#062951')
})
const oceanMeshLarge = new THREE.Mesh(oceanGeometryLarge, oceanMaterialLarge);
oceanMeshLarge.rotation.x = - Math.PI * 0.5
oceanMeshLarge.position.y -= 0.2;
scene.add(oceanMeshLarge);

const oceanGeometry = new THREE.PlaneGeometry(50, 50, 512, 512)
const oceanMaterial = new THREE.ShaderMaterial({
    vertexShader: oceanVertexShader,
    fragmentShader: oceanFragmentShader,
    //fog: true,
    //wireframe: true,
    uniforms:
    {
        uBigWavesElevation: {
            value: 0.01
        },
        uBigWavesFrequency: {
            value: new THREE.Vector2(0, 0)
        },
        uTime: {
            value: 0
        },
        uBigWaveSpeed: {
            value: 0
        },
        uDepthColor: {
            value: new THREE.Color(debugObject.depthColor)
        },
        uSurfaceColor: {
            value: new THREE.Color(debugObject.surfaceColor)
        },
        uElevationSize: {
            value: 2.23
        },
        uElevationOffset: {
            value: 0.1
        },
        uNoiseMultiplier: {
            value: 10
        },
        uNoiseElevation: {
            value: 0.02
        },
        uTimeScale: {
            value: 0.05
        },
        uNoise: {
            value: 8.0
        }
    }
})
const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)    
ocean.rotation.x = - Math.PI * 0.5
ocean.position.y -= 0.01;
scene.add(ocean)

gui.add(oceanMaterial.uniforms.uBigWavesElevation, 'value')
    .min(0).max(1).step(0.001).name('Elevation')
gui.add(oceanMaterial.uniforms.uElevationSize, 'value')
    .min(0).max(10).step(0.001).name('Elevation size')
gui.add(oceanMaterial.uniforms.uElevationOffset, 'value')
    .min(0).max(1).step(0.001).name('Elevation offset')

gui.add(oceanMaterial.uniforms.uBigWavesFrequency.value, 'x')
    .min(0).max(10).step(0.01).name('Frequency X')
gui.add(oceanMaterial.uniforms.uBigWavesFrequency.value, 'y')
    .min(0).max(10).step(0.01).name('Frequency Y')


gui.add(oceanMaterial.uniforms.uNoiseMultiplier, 'value')
    .min(1).max(10).step(0.1).name('Noise frequency')
gui.add(oceanMaterial.uniforms.uNoiseElevation, 'value')
    .min(0).max(2).step(0.001).name('Noise elevation')
gui.add(oceanMaterial.uniforms.uTimeScale, 'value')
    .min(0).max(10).step(0.001).name('Noise timescale')
gui.add(oceanMaterial.uniforms.uNoise, 'value')
    .min(2).max(8).step(1).name('Noise iterations')

gui.add(oceanMaterial.uniforms.uBigWaveSpeed, 'value')
    .min(0).max(10).step(0.01).name('Wave Speed')

gui.addColor(debugObject, 'depthColor')
    .name('Depth color').onChange(
        () => oceanMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
    )
gui.addColor(debugObject, 'surfaceColor')
    .name('Surface color').onChange(
        () => oceanMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
    )
gui.add(oceanMaterial, 'wireframe')
    .name('Wireframe');



/**
 * Light helpders
 */
const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial()
)

directionalLightHelper.material.color.setRGB(0.1, 0.1, 1.0)
directionalLightHelper.material.side = THREE.DoubleSide
directionalLightHelper.rotation.x = - Math.PI * 0.5
scene.add(directionalLightHelper)

// const directionalLight = new THREE.DirectionalLight(new THREE.Color('#FFFFFF'), 1.0)
// directionalLight.position.set(1, 0.25, 0)
// directionalLight.castShadow = true;
// scene.add(directionalLight)
/**
 * Animate                                                                                                                                                                                          
 */
const clock = new THREE.Clock()

const tick = () =>
{
    // Update controls
    const elapsedTime = clock.getElapsedTime()
    controls.update()

    oceanMaterial.uniforms.uTime.value = elapsedTime;
    directionalLightHelper.position.set(islandMaterial.uniforms.uSunPositionX.value, islandMaterial.uniforms.uSunPositionY.value, islandMaterial.uniforms.uSunPositionZ.value)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
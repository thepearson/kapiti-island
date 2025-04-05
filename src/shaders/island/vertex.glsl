uniform sampler2D uMap;
uniform vec2 uTexelSize;          // Size of one texel (1/width, 1/height)
uniform float uDisplacementScale; // Scale factor for height

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Your custom uniforms

void main()
{

    float displacement = texture(uMap, uv).r; // Read height from texture
    vec3 lPosition = position;

    lPosition.z += displacement * uDisplacementScale;

    // Position
    vec4 modelPosition = modelMatrix * vec4(lPosition, 1.0);

    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Transform the normal based on the model, as it can rotate
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Varying
    vNormal = modelNormal.xyz;
    vPosition = modelPosition.xyz;
    vUv = uv;
    // vUv = uv; // Pass UV straight through

    // // --- Calculate Displaced Position ---
    // float centerHeight = texture(uMap, vUv).r; // Read height from texture

    // // Displace along the mesh's local Z-axis. Modify if displacement is needed along the normal instead.
    // vec3 displacedPosition = position + vec3(0.0, 0.0, centerHeight * uDisplacementScale);

    // // Sample heights of neighbors using texel size
    // float hL = texture(uMap, vUv - vec2(uTexelSize.x, 0.0)).r; // Left
    // float hR = texture(uMap, vUv + vec2(uTexelSize.x, 0.0)).r; // Right
    // float hD = texture(uMap, vUv - vec2(0.0, uTexelSize.y)).r; // Down
    // float hU = texture(uMap, vUv + vec2(0.0, uTexelSize.y)).r; // Up

    // // Calculate scaled height differences
    // float dZdU = (hR - hL) * uDisplacementScale;
    // float dZdV = (hU - hD) * uDisplacementScale;

    // // Calculate object-space normal
    // // The constant factor relates the UV step (uTexelSize) to the height derivatives.
    // // The sign (-) might need flipping depending on UV orientation and desired normal direction.
    // vec3 objectNormal = normalize(vec3(-dZdU, -dZdV, 2.0 * uTexelSize.x));

    // // --- Transform Position and Normal for output ---
    // vec4 viewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    // gl_Position = projectionMatrix * viewPosition;

    // // Transform recalculated object-space normal into view-space
    // vNormal = normalize(normalMatrix * objectNormal);

    // // Pass view-space position (useful for lighting)
    // vPosition = viewPosition.xyz;
}
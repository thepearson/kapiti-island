uniform sampler2D uMap;
varying vec2 vUv;

void main()
{
    vec3 xPosition = position;
    float height = texture2D(uMap, uv).r;

    // Final position
    xPosition.z += height;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(xPosition, 1.0);
    
    vUv = uv;
}
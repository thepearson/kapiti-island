uniform sampler2D uMap;

uniform float uSunPositionX;
uniform float uSunPositionY;
uniform float uSunPositionZ;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../lights/ambientLight.glsl
#include ../lights/directionalLight.glsl

void main()
{
    vec3 color = vec3(1.0);
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(-vPosition);

    vec3 lights = vec3(0.0);
    lights += ambientLight(vec3(0.5, 0.5, 0.7), 0.2);
    lights += directionalLight(
        vec3(1.0, 1.0, 0.8),
        500.,
        vNormal,
        vec3(uSunPositionX, uSunPositionY, uSunPositionZ),
        viewDirection,
        16.0
    );

    color *= lights;

    gl_FragColor = vec4(color, 1.0);

}
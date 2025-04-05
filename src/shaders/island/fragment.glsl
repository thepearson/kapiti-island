uniform sampler2D uMap;
uniform sampler2D uColor;

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
    vec4 texColor = texture(uColor, vUv);
    vec3 color = texColor.rgb;

    if (texColor.a == 0.0) {
        discard;
    }
    

    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    // vec3 lights = vec3(0.0);
    //lights += ambientLight(vec3(0.5, 0.5, 0.5), 1.0);
    // lights += directionalLight(
    //     vec3(1.0, 1.0, 1.0),    // Light color
    //     10.0,                    // Light intensity
    //     normal,                 // normal
    //     vec3(uSunPositionX, uSunPositionY, uSunPositionZ),    // position
    //     viewDirection,          // View direction
    //     2.0                    // Specular Power
    // );

    //color *= lights;

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>

}
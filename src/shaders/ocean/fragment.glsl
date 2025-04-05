uniform sampler2D uMap;
varying vec2 vUv;
void main()
{
    vec4 color = vec4(0.0, 0.2, 0.0, 1.0);
    float alpha = texture(uMap, vUv).a;

    if (alpha == 0.0) {
        discard;
    }
    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
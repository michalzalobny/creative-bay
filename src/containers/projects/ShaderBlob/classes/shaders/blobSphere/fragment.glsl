//based on threeJS's fresnelShader : https://github.com/ebrahma/threejs_div_testing/blob/b5aa918fba0da04e5b78ee6168450945b5630b71/js/three-lib/shaders/FresnelShader.js

uniform samplerCube tCube;
uniform float uColorFactor;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;

void main() {
    vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );
    vec4 refractedColor = vec4( 1.0 );
    refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
    refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
    refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;

    vec4 finalColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );

    //Convert to gray
    float gray = 0.21 * finalColor.r + 0.71 * finalColor.g + 0.07 * finalColor.b;
    gl_FragColor = vec4(finalColor.rgb * (1.0 - uColorFactor) + (gray * uColorFactor), finalColor.a);

    //Testing different refractions ~ magnifying glass effect 
    // refractedColor = vec4( 1.0 );
    // refractedColor.r = textureCube( tCube, vec3( vRefract[0].x, vRefract[0].yz ) ).r;
    // refractedColor.g = textureCube( tCube, vec3( vRefract[1].x, vRefract[1].yz ) ).g;
    // refractedColor.b = textureCube( tCube, vec3( vRefract[2].x, vRefract[2].yz ) ).b;
    // gl_FragColor = refractedColor;
    
}
varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;

#define mRefractionRatio 1.02
#define mFresnelBias 0.1
#define mFresnelScale 4.0 //2.0 - default
#define mFresnelPower 2.0 //1.0 - default

void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    vec3 I = worldPosition.xyz - cameraPosition;
    vReflect = reflect( I, worldNormal );
    vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );
    vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );
    vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );
    vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );
    gl_Position = projectionMatrix * mvPosition;
}
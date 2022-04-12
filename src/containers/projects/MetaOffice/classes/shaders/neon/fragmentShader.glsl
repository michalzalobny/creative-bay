uniform float uTime;

void main()
{
  float t = sin(uTime * 4.0) * 0.5 + 0.5;

  vec3 c1 = vec3(0.75, 0.75, 0.75);
  vec3 c2 = vec3(1.0, 1.0, 1.0);
  // vec3 cFinal = mix(c1,c2, t * t);
  gl_FragColor = vec4(c2, 0.75 * t + 0.25);
}
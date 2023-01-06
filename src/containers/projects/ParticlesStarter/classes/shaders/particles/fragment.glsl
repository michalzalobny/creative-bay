uniform sampler2D tMask;

void main()
{
  vec4 t1 = texture2D(tMask, gl_PointCoord);
  gl_FragColor.rgba = vec4(vec3(1.0),t1.a);
}
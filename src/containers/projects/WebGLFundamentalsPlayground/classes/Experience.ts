import fragmentShader from './shaders/helloWorld/fragment.glsl';
import vertexShader from './shaders/helloWorld/vertex.glsl';
import * as webglUtils from './utils/webglUtils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import * as m3 from './utils/m3.ext-lib';

interface Constructor {
  gl: WebGL2RenderingContext | null;
}

export class Experience {
  _program: WebGLProgram | null = null;
  _shader: WebGLShader | null = null;
  _gl: WebGL2RenderingContext | null;
  _vao: WebGLVertexArrayObject | null = null;
  _matrixLocation: WebGLUniformLocation | null = null;

  constructor({ gl }: Constructor) {
    this._gl = gl;
    this._generateShaders();
    this._supplyData();
  }

  _updateGlSize() {
    if (!this._gl) return;
    webglUtils.resizeCanvasToDisplaySize(this._gl.canvas);
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    this._gl.clearColor(0, 0, 0, 0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);
  }

  randomInt(range: number) {
    return Math.floor(Math.random() * range);
  }

  setRectangle(
    gl: WebGL2RenderingContext | null,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    if (!gl) return;
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
    // whatever buffer is bound to the `ARRAY_BUFFER` bind point
    // but so far we only have one buffer. If we had more than one
    // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      gl.STATIC_DRAW
    );
  }

  setGeometry(gl: WebGL2RenderingContext | null) {
    if (!gl) return;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-150, -100, 150, -100, -150, 100, 150, -100, -150, 100, 150, 100]),
      gl.STATIC_DRAW
    );
  }

  _supplyData() {
    if (!this._gl || !this._program) return;
    this._gl.useProgram(this._program);

    // Create set of attributes
    this._vao = this._gl.createVertexArray();
    this._gl.bindVertexArray(this._vao);

    //attributes
    const positionLocation = this._gl.getAttribLocation(this._program, 'a_position');
    const colorLocation = this._gl.getAttribLocation(this._program, 'a_color');

    //uniforms
    this._matrixLocation = this._gl.getUniformLocation(this._program, 'u_matrix');

    // Create a buffer for the positons.
    let buffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);

    this.setGeometry(this._gl);

    // tell the position attribute how to pull data out of the current ARRAY_BUFFER
    this._gl.enableVertexAttribArray(positionLocation);
    let size = 2;
    let type = this._gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    this._gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    // Create a buffer for the colors.
    buffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);

    // Set the colors.
    this.setColors(this._gl);

    // tell the color attribute how to pull data out of the current ARRAY_BUFFER
    this._gl.enableVertexAttribArray(colorLocation);
    size = 4;
    type = this._gl.UNSIGNED_BYTE;
    normalize = true;
    stride = 0;
    offset = 0;
    this._gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

    this.drawScene(this._gl, this._vao);
  }

  drawScene(gl: WebGL2RenderingContext | null, vao: WebGLVertexArrayObject | null) {
    if (!gl || !vao) return;
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(this._program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // Compute the matrices
    const translation = [400, 150];
    const angleInRadians = 0;
    const scale = [1, 1];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    matrix = m3.translate(matrix, translation[0], translation[1]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    matrix = m3.rotate(matrix, angleInRadians);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    matrix = m3.scale(matrix, scale[0], scale[1]);

    // Set the matrix.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    gl.uniformMatrix3fv(this._matrixLocation, false, matrix);

    // Draw the geometry.
    const offset = 0;
    const count = 6;
    gl.drawArrays(gl.TRIANGLES, offset, count);
  }

  setColors(gl: WebGL2RenderingContext | null) {
    if (!gl) return;
    // Pick 2 random colors.
    const r1 = Math.random() * 256; // 0 to 255.99999
    const b1 = Math.random() * 256; // these values
    const g1 = Math.random() * 256; // will be truncated
    const r2 = Math.random() * 256; // when stored in the
    const b2 = Math.random() * 256; // Uint8Array
    const g2 = Math.random() * 256;

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
        // Uint8Array
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 256,
        255,
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 256,
        255,
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 256,
        255,
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 256,
        255,
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 256,
        255,
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 256,
        255,
      ]),
      gl.STATIC_DRAW
    );
  }

  _generateShaders() {
    if (this._gl) {
      const vertexShaderGL = this._createShader(this._gl, this._gl.VERTEX_SHADER, vertexShader);
      const fragmentShaderGL = this._createShader(
        this._gl,
        this._gl.FRAGMENT_SHADER,
        fragmentShader
      );

      if (!vertexShaderGL || !fragmentShaderGL) return;
      this._program = this._createProgram(this._gl, vertexShaderGL, fragmentShaderGL) || null;
    }
  }

  _createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
    if (success) {
      return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  _createShader(gl: WebGL2RenderingContext, type: number, source: string) {
    this._shader = gl.createShader(type);
    if (!this._shader) return;
    gl.shaderSource(this._shader, source);
    gl.compileShader(this._shader);
    const success = gl.getShaderParameter(this._shader, gl.COMPILE_STATUS) as boolean;
    if (success) {
      return this._shader;
    }
    console.log(gl.getShaderInfoLog(this._shader));
    gl.deleteShader(this._shader);
    return;
  }

  destroy() {
    if (!this._gl) return;
    this._gl.deleteProgram(this._program);
    this._gl.deleteShader(this._shader);
  }
}

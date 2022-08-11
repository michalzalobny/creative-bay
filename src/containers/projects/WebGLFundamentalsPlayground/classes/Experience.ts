import fragmentShader from './shaders/helloWorld/fragment.glsl';
import vertexShader from './shaders/helloWorld/vertex.glsl';
import * as webglUtils from './utils/webglUtils';

interface Constructor {
  gl: WebGL2RenderingContext | null;
}

export class Experience {
  _program: WebGLProgram | null = null;
  _shader: WebGLShader | null = null;
  _gl: WebGL2RenderingContext | null;

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

  _supplyData() {
    if (!this._gl || !this._program) return;
    const positionAttributeLocation = this._gl.getAttribLocation(this._program, 'a_position');
    const positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);

    // three 2d points
    const positions = [0, 0, 0, 0.5, 0.7, 0];
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(positions), this._gl.STATIC_DRAW);

    const vao = this._gl.createVertexArray(); //vertex array object
    this._gl.bindVertexArray(vao);
    this._gl.enableVertexAttribArray(positionAttributeLocation);

    //How to pull the data out
    const size = 2; // 2 components per iteration
    const type = this._gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    this._gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    this._updateGlSize();

    // Tell it to use our program (pair of shaders)
    if (this._program) {
      this._gl.useProgram(this._program);
    }

    // Bind the attribute/buffer set we want.
    this._gl.bindVertexArray(vao);

    //After all that we can finally ask WebGL to execute our GLSL program.
    const primitiveType = this._gl.TRIANGLES;
    const offset2 = 0;
    const count = 3;
    this._gl.drawArrays(primitiveType, offset2, count);
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

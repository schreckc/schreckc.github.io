// WebGL - Fundamentals
// from https://webglfundamentals.org/webgl/webgl-fundamentals.html

/* eslint no-console:0 consistent-return:0 */
"use strict";

// m1 should be of size n1xn2 and m2 of size n2xn1
function multiplyMatrices(m1, m2, n1, n2) {
  var result = new Array(n1 * n1);
  for (var i = 0; i < n1; ++i) {
    for (var j = 0; j < n2; ++j) {
      var ind = i * n2 + j;
      result[ind] = 0;
      for (var k = 0; k < n2; ++k) {
        result[ind] += m1[i * n2 + k] * m2[k * n2 + j];
      }
    }
  }
  return result;
}

function multiplyM4(m1, m2) {
  var result = new Array(16);
  for (var ii = 0; ii < 4; ++ii) {
    for (var j = 0; j < 4; ++j) {
      var ind = ii * 4 + j;
      result[ind] = 0;
      for (var k = 0; k < 4; ++k) {
        result[ind] += m1[ii * 4 + k] * m2[k * 4 + j];
      }
    }
  }
  return result;
}

function rotx(angle) {
  var r = [
    1, 0, 0, 0,
    0, Math.cos(angle), -Math.sin(angle), 0,
    0, Math.sin(angle), Math.cos(angle), 0,
    0, 0, 0, 1,
  ];
  return r;
}

function roty(angle) {
  var r = [
    Math.cos(angle), 0, Math.sin(angle), 0,
    0, 1, 0, 0,
    -Math.sin(angle), 0, Math.cos(angle), 0,
    0, 0, 0, 1,
  ];
  return r;
}

function rotz(angle) {
  var r = [
    Math.cos(angle), -Math.sin(angle), 0, 0,
    Math.sin(angle), Math.cos(angle), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
  return r;
}

function scale(s1, s2, s3) {
  var s = [
    s1, 0, 0, 0,
    0, s2, 0, 0,
    0, 0, s3, 0,
    0, 0, 0, 1
  ];
  return s;
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function createCube(gl) {
  var cubeVertices = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ];
  var positions = [
    cubeVertices[2], cubeVertices[0], cubeVertices[1],
    cubeVertices[0], cubeVertices[2], cubeVertices[3],
    cubeVertices[0], cubeVertices[4], cubeVertices[1],
    cubeVertices[1], cubeVertices[4], cubeVertices[5],
    cubeVertices[0], cubeVertices[3], cubeVertices[4],
    cubeVertices[4], cubeVertices[3], cubeVertices[7],
    cubeVertices[5], cubeVertices[4], cubeVertices[6],
    cubeVertices[6], cubeVertices[4], cubeVertices[7],
    cubeVertices[1], cubeVertices[5], cubeVertices[2],
    cubeVertices[2], cubeVertices[5], cubeVertices[6],
    cubeVertices[2], cubeVertices[6], cubeVertices[3],
    cubeVertices[3], cubeVertices[6], cubeVertices[7],
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions.flat()), gl.STATIC_DRAW);
}

function createCubeColor(gl) {
  var color_set = [
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
    [1, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 1, 1, 1],
  ];

  var colors = [
    color_set[0], color_set[0], color_set[0],
    color_set[0], color_set[0], color_set[0],
    color_set[1], color_set[1], color_set[1],
    color_set[1], color_set[1], color_set[1],
    color_set[2], color_set[2], color_set[2],
    color_set[2], color_set[2], color_set[2],
    color_set[3], color_set[3], color_set[3],
    color_set[3], color_set[3], color_set[3],
    color_set[4], color_set[4], color_set[4],
    color_set[4], color_set[4], color_set[4],
    color_set[5], color_set[5], color_set[5],
    color_set[5], color_set[5], color_set[5],
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.flat()), gl.STATIC_DRAW);
}

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // Turn on culling. By default backfacing triangles
  // will be culled.
  //gl.enable(gl.CULL_FACE);  // I commented this line so we can see the inside side of the face also

  // Enable the depth buffer
  gl.enable(gl.DEPTH_TEST);

  // Get the strings for our GLSL shaders
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  var colorLocation = gl.getUniformLocation(program, "color");
  var sizeLocation = gl.getUniformLocation(program, "canvasSize");
  var transfoLocation = gl.getUniformLocation(program, "u_transfo");


  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();
  var colorBuffer = gl.createBuffer();


  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  gl.uniform2f(sizeLocation, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enableVertexAttribArray(colorAttributeLocation);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 4; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    colorAttributeLocation, size, type, normalize, stride, offset);


  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  createCube(gl);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    createCubeColor(gl);


      /*** HANDLING THE POSTION ATTRIBUTE ***/
  // table with the position of the vertices of the triangle(s) 
  var uvs = [
      [1, 1],  // 0
      [-1, -1],
      [-1, 1],

      [-1, -1],
      [1, 1],
      [1, -1],

      [1, 1],  // 0
      [-1, 1],
      [1, -1],

      [1, -1],
      [-1, 1],
      [-1, -1],

      [1, 1],  // 0
      [-1, 1],
      [1, -1],

      [1, -1],
      [-1, 1],
      [-1, -1],

      [1, 1],  // 0
      [-1, 1],
      [1, -1],

      [1, -1],
      [-1, 1],
      [-1, -1],
      
      [1, 1],  // 0
      [-1, 1],
      [1, -1],

      [1, -1],
      [-1, 1],
      [-1, -1],


      [1, 1],  // 0
      [-1, 1],
      [1, -1],

      [1, -1],
      [-1, 1],
      [-1, -1],

  ];

  // Create a buffer and put three 2d clip space points in it
  var uvBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

  // write the position in the buffer pointed by gl.ARRAY_BUFFER  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs.flat()), gl.STATIC_DRAW);

  // look up where the vertex data needs to go.
  var uvAttributeLocation = gl.getAttribLocation(program, "a_uv");

  // Turn on the attribute
  gl.enableVertexAttribArray(uvAttributeLocation);

  // Bind the position buffer.
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    uvAttributeLocation, size, type, normalize, stride, offset);

  /*** HANDLING THE POSTION ATTRIBUTE ***/

  var sc1 = scale(0.6, 0.6, 0.6);
  var r1 = rotx(Math.PI / 4.0);
  var t1 = multiplyM4(r1, sc1);
  var sc2 = scale(0.4, 0.4, 0.4);
  var r2 = multiplyM4(roty(Math.PI / 4.0), rotx(Math.PI / 4.0));
  var t2 = multiplyM4(r2, sc2);
  var sc3 = scale(0.25, 0.25, 0.25);
  var r3 = multiplyM4(roty(Math.PI / 4.0), rotx(Math.PI / 4.0));
  var t3 = multiplyM4(r3, sc3);

  var then = 0;
  requestAnimationFrame(drawScene);
  var t = 0;

  function drawScene(now) {
    // prevent the programn to run more than 60 fps
    if (now - then > 33) {
      var ry = roty(0.01);
      t1 = multiplyM4(ry, t1);
      gl.uniformMatrix4fv(transfoLocation, false, t1);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      // draw
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 36;
      gl.drawArrays(primitiveType, offset, count);

      var ry2 = roty(-0.02);

      t2 = multiplyM4(ry2, t2);
      gl.uniformMatrix4fv(transfoLocation, false, t2);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      // draw
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 36;
	gl.drawArrays(primitiveType, offset, count);

      var rz3 = rotz(-0.03);
      t3 = multiplyM4(rz3, t3);
      gl.uniformMatrix4fv(transfoLocation, false, t3);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      // draw
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 36;
      gl.drawArrays(primitiveType, offset, count);

if (t < 500) {
++t;
      then = now;
      }
    }
    // Call drawScene again next frame
    requestAnimationFrame(drawScene);
  }


}

main();

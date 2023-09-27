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

//rotatiom matrices. Angle is defined in radian

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

function translate(t1, t2, t3) {
  var t = [
    1, 0, 0, t1,
    0, 1, 0, t2,
    0, 0, 1, t3,
    0, 0, 0, 1
  ];
  return t;
}

function transpose(m) {
  var t = [
    m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15],
  ];
  return t;
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

function main() {

  /** Initialization ***/
  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // Enable the depth buffer
  gl.getExtension("EXT_frag_depth");
  gl.enable(gl.DEPTH_TEST);
 
 // cull faces whose normal point away from the camera
  // gl.enable(gl.CULL_FACE);
  // gl.cullFace(gl.BACK);

  // Get the strings for our GLSL shaders
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
  /* *** */


  /*** Code to handle positions attribute ***/
  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  /* The following paragraph is to create a buffer and write the positions inside it */
  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer) and write the array positions in the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [
    [-1, -1], 
    [1, -1], 
      [-1, 1],
      
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions.flat()), gl.STATIC_DRAW);
  /*The following paragraph is for binding the positions' buffer to the vertex attribute located at positionAttributeLocation */
  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);
  /* *** */

  /*** Code to handle colors attribute ***/
  // look up where the vertex data needs to go.
  var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  /* The following paragraph is to create a buffer and write the positions inside it */
  // Create a buffer and put three 2d clip space points in it
  var colorBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer) and write the array positions in the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  var colors = [
    [0.2, 0.2, 0.8, 1],
    [0.2, 0.2, 0.8, 1],
    [0.2, 0.2, 0.8, 1],
    [0.2, 0.2, 0.8, 1],
    [0.2, 0.2, 0.8, 1],
    [0.2, 0.2, 0.8, 1],
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.flat()), gl.STATIC_DRAW);
  /*The following paragraph is for binding the positions' buffer to the vertex attribute located at positionAttributeLocation */
  // Turn on the attribute
  gl.enableVertexAttribArray(colorAttributeLocation);
  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 4; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    colorAttributeLocation, size, type, normalize, stride, offset);
  /* *** */
        

  /*** code to handle uniform parameters **/
  // look up where the uniform data needs to go.
  var ratioLocation = gl.getUniformLocation(program, "u_ratio");
                  
  // write a uniform attirbute                  
  gl.uniform1f(ratioLocation, gl.canvas.width / gl.canvas.height);
  /* *** */


  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
  
  var then = 0;
  var t = 0;
  
  requestAnimationFrame(drawScene);


  function drawScene(now) {
    // prevent the programn to run more than 60 fps
    if (now - then > 33) {   
    
    
      // draw
      gl.drawArrays(primitiveType, offset, count);
      then = now;
    }

    if (t < 500) { // stop after 200 frames
      ++t;
      // Call drawScene again next frame
      requestAnimationFrame(drawScene);
    }
  } //end drawScene
}

main();

// WebGL - Fundamentals
// from https://webglfundamentals.org/webgl/webgl-fundamentals.html

/* eslint no-console:0 consistent-return:0 */
"use strict";

// WebGL - Fundamentals
// from https://webglfundamentals.org/webgl/webgl-fundamentals.html

/* eslint no-console:0 consistent-return:0 */
"use strict";

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
  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // Enable the depth buffer
    gl.getExtension("EXT_frag_depth");
    gl.enable(gl.DEPTH_TEST);    

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



  /*** HANDLING THE POSTION ATTRIBUTE ***/
  // table with the position of the vertices of the triangle(s) 
  var positions = [
    [-1, -1],
    [-1, 1],
     [1, -1],

      [1, -1],
      [-1, 1],
      [1, 1],
  ];

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // write the position in the buffer pointed by gl.ARRAY_BUFFER  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions.flat()), gl.STATIC_DRAW);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  /*** HANDLING THE POSTION ATTRIBUTE ***/



     /*** HANDLING THE Col ATTRIBUTE ***/
  // table with the position of the vertices of the triangle(s) 
  var colors = [
      [0, 0, 1.0],
      [0, 0.0, 1.0],
      [1.0, 0, 0],

      [1.0, 0, 0.0],
      [0, 0.0, 1.0],
      [1.0, 0, 0],
  ];

  // Create a buffer and put three 2d clip space points in it
  var colorBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  // write the position in the buffer pointed by gl.ARRAY_BUFFER  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.flat()), gl.STATIC_DRAW);

  // look up where the vertex data needs to go.
  var colorAttributeLocation = gl.getAttribLocation(program, "a_color");

  // Turn on the attribute
  gl.enableVertexAttribArray(colorAttributeLocation);

  // Bind the position buffer.
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3; // 3 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    colorAttributeLocation, size, type, normalize, stride, offset);

  /*** HANDLING THE Col ATTRIBUTE ***/


    /** handling uniform **/
    var csizeLocation = gl.getUniformLocation(program, "csize");
    gl.uniform2f(csizeLocation, gl.canvas.width, gl.canvas.height);

    var rLocation = gl.getUniformLocation(program, "r");
   // gl.uniform1f(rLocation, 0.5);

    var posLocation = gl.getUniformLocation(program, "pos");
  //  gl.uniform2f(posLocation, -0.5, 0.0);

     
    /**end handling uniform **/

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);

 requestAnimationFrame(drawScene);

  var time = 0;
  var then = 0;

  function drawScene(now) {
    // prevent the programn to run more than 60 fps
    if (now - then > 33) {
	// draw

	//circle 1
	gl.uniform1f(rLocation, 0.01 * time);
	gl.uniform2f(posLocation, 0.4, 0.75);
	gl.drawArrays(primitiveType, offset, count);

        gl.uniform1f(rLocation, 1-0.01 * time);
        gl.uniform2f(posLocation, -0.5, -0.3);
	gl.drawArrays(primitiveType, offset, count);

	

	gl.drawArrays(primitiveType, offset, count);
	then = now;
	++time;
    }
      if (time < 100) { // Stop the animation after 100 frames
          requestAnimationFrame(drawScene);
      }
  }

    
  //  gl.uniform2f(sizeLocation, canvas.witdth, canvas.height);
}

main();

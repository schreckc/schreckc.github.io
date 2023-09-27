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

function createBall(gl) {
  var p1 = [-1, -1];
  var p2 = [1, -1];
  var p3 = [1, 1];
  var p4 = [-1, 1];

  var positions = [
    p1, p2, p3,
    p3, p4, p1,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions.flat()), gl.STATIC_DRAW);
}

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  
    gl.getExtension("EXT_frag_depth");
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





  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
  
    // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");  
  var positionBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  createBall(gl);

 
  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);


  var colorLocation = gl.getUniformLocation(program, "color");
  var ratioLocation = gl.getUniformLocation(program, "ratio_res");
  var radiusLocation = gl.getUniformLocation(program, "radius");
  var centerLocation = gl.getUniformLocation(program, "center");
  var lightLocation = gl.getUniformLocation(program, "light");

  var ratio_res = gl.canvas.height / canvas.width;
 gl.uniform1f(ratioLocation, ratio_res);

  var centerList = [];
  var radiusList = [];
  var colorList = [];
  var dirList = [];

  var speed = 0.02;


  for (var ii = 0; ii < 100; ++ii) {
    var radius = 0.05 + Math.random() / 10;
    var center = [0.9 * (Math.random() * 2 - 1), 
                  0.9 * ratio_res * (Math.random() * 2 - 1), 
                  1 - 0.5 * Math.random()];
    var color = [Math.random(), Math.random(), Math.random(), 1];
    var dir = [Math.random(), Math.random()];
    centerList.push(center);
    radiusList.push(radius);
    colorList.push(color);
    dirList.push(dir);
  }

  var then = 0;
  var light = [1, 1, 1];
  // normalize light vector
  light[0] /= Math.sqrt(light[0] * light[0] + light[1] * light[1] + light[2] * light[2]);
  light[1] /= Math.sqrt(light[0] * light[0] + light[1] * light[1] + light[2] * light[2]);
  light[2] /= Math.sqrt(light[0] * light[0] + light[1] * light[1] + light[2] * light[2]);

  gl.uniform3fv(lightLocation, light);
  
  requestAnimationFrame(drawScene);
  var t = 0;

  function drawScene(now) {
    // prevent the programn to run more than 60 fps
    if (now - then > 33) {
      for (var ii = 0; ii < centerList.length; ++ii) {
        var center = centerList[ii];
        var radius = radiusList[ii];
        var color = colorList[ii];
        var dir = dirList[ii];

        center[0] += speed * dir[0];
        center[1] += speed * dir[1];
        if (center[0] - radius < -1 || center[0] + radius > 1) {
          dir[0] = -dir[0];
          center[0] += speed * dir[0];
          dirList[ii] = dir;
        }
        if (center[1] < (-1 + radius) * ratio_res || center[1] > (1 - radius) * ratio_res) {
          dir[1] = -dir[1];
          center[1] += speed * dir[1];
          dirList[ii] = dir;
        }

        centerList[ii] = center;

 
        gl.uniform3fv(centerLocation, center);
        gl.uniform1f(radiusLocation, radius);
        gl.uniform4fv(colorLocation, color);
        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
      }
      then = now;
      ++t;
    }
    if (t < 500) {
    // Call drawScene again next frame
    requestAnimationFrame(drawScene);
    }
  }


}

main();

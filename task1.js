/*
var mvMatrix = mat4.create();
var mvMatrixStack = [];

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}
*/
//The above is defined in modelViewMatrixStack.js

function main() {
  	var canvas = document.getElementById('webgl');
	var gl = getWebGLContext(canvas);
	if (!gl){
		console.log('Failed to find context');
	}
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram (program);
	gl.program = program;
	
	var numberOfVertices = initVertices(program, gl);
	
	render(gl, numberOfVertices);
}

function initTransformations(gl, modelMatrix){
	var transformationMatrix = gl.getUniformLocation(gl.program, 'transformationMatrix');
	gl.uniformMatrix4fv(transformationMatrix, false, flatten(modelMatrix));	

}

function render (gl, numberOfVertices){
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	mvPushMatrix();
	mat4.translate(mvMatrix, mvMatrix, [0.5, 0.5, 0.0]);
	initTransformations(gl, mvMatrix );
	gl.drawArrays(gl.TRIANGLES, 0, numberOfVertices);

	mvPopMatrix();
	mvPushMatrix();
	mat4.translate(mvMatrix, mvMatrix, [-0.5, 0.5, 0.0]);
	mat4.rotateZ(mvMatrix, mvMatrix, 0.785398);
	initTransformations(gl, mvMatrix );
	gl.drawArrays(gl.TRIANGLES, 0, numberOfVertices);

	
	mvPopMatrix();
	mvPushMatrix();
	mat4.translate(mvMatrix, mvMatrix, [-0.5, -0.5, 0.0]);
	mat4.rotateZ(mvMatrix, mvMatrix, -0.785398);
	mat4.scale(mvMatrix,mvMatrix,[2,2,0]);
	initTransformations(gl, mvMatrix );
	gl.drawArrays(gl.TRIANGLES, 0, numberOfVertices);

	mvPopMatrix();
	mvPushMatrix();
	
	var shMatrix = [
						1.0,0.0,0.0,0.0,
						0.5,1.0,0.0,0.0,
						0.5,0.0,1.0,0.0,
						0.0,0.0,0.0,1.0,
					]


	mat4.translate(mvMatrix, mvMatrix, [0.5, -0.5, 0.0]);
	mat4.multiply(mvMatrix,mvMatrix,shMatrix);
	initTransformations(gl, mvMatrix );
	gl.drawArrays(gl.TRIANGLES, 0, numberOfVertices);





}

function initVertices(program, gl){
	var vertices = [-0.15, -0.15, 0.15, -0.15, 0, 0.15];
	var noOfDim = 2;
	var numberOfVertices = vertices.length / noOfDim;
	
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer){ console.log('Failed to create the buffer object ');	return -1;}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	
	var a_Position = gl.getAttribLocation(program, 'a_Position');
	if (a_Position < 0) { console.log ("Failed to Get Position"); return;	}
	
	gl.vertexAttribPointer(a_Position, noOfDim, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);
	
	return numberOfVertices;
}


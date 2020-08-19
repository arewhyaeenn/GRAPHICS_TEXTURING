var RunDemo = function (filemap)
{
	console.log("Initializing Demo");

	// get canvas, set dimensions to fill browser window
	var canvas = document.getElementById('the_canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// get WebGL context, confirm...
	var gl = canvas.getContext('webgl');

	if (!gl)
	{
		console.log('Browser is using experimental webgl.');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('This requires a browser which supports WebGL; Yours does not.');
	}

	// set background color and clear
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// set up culling via depth and back face, set front face to CCW
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	// create shader program
	var uvProgram = createShader(
		gl, 
		filemap['uvVertexShaderText'],
		filemap['uvFragShaderText']
	);

	var rgbProgram = createShader(
		gl, 
		filemap['rgbVertexShaderText'],
		filemap['rgbFragShaderText']
	);

	var uniformProgram = createShader(
		gl,
		filemap['uniformVertexShaderText'],
		filemap['uniformFragShaderText']
	);

	var shaders = [
		uvProgram,
		rgbProgram,
		uniformProgram
	];

	// camera
	var viewMatrix = new Float32Array(16);
	var cameraPosition = [0,7,15];
	var lookAtPosition = [0,2,0];
	var cameraUpDirection = [0,1,0];
	mat4.lookAt(
		viewMatrix,       // target matrix to apply values to
		cameraPosition,   // where is the camera
		lookAtPosition,   // what point is the camera looking at
		cameraUpDirection // which direction is upward from the cameras PoV
	);

	var projMatrix = new Float32Array(16);
	var fieldOfView = Math.PI / 4;
	var aspect = canvas.width / canvas.height;
	var near = 0.01;
	var far = 1000.0;
	mat4.perspective(
		projMatrix,  // target matrix
		fieldOfView, // vertical field of view, in radians
		aspect,      // aspect ratio
		near,        // distance to near clip plane
		far          // distance to far clip plane
	);

	// light
	var ambientLight = [0.2, 0.2, 0.2];
	var lightDirection = [1, -0.5, -1];
	var lightIntensity = [1.0, 1.0, 1.0];

	// apply light and camera to shaders
	for (var i = 0; i < shaders.length; i++)
	{
		var shader = shaders[i];

		gl.useProgram(shader);

		var matViewUniformLocation = gl.getUniformLocation(shader, 'mView');
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

		var matProjUniformLocation = gl.getUniformLocation(shader, 'mProj');
		gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	
		var ambientLightUniformLocation = gl.getUniformLocation(shader, 'ambientLight');
		gl.uniform3fv(ambientLightUniformLocation, ambientLight);

		var lightDirectionUniformLocation = gl.getUniformLocation(shader, 'lightDirection');
		var lightIntensityUniformLocation = gl.getUniformLocation(shader, 'lightIntensity');
		gl.uniform3fv(lightDirectionUniformLocation, lightDirection);
		gl.uniform3fv(lightIntensityUniformLocation, lightIntensity);
	}

	// initial models

	var rgbCube = new RGBMesh(
		gl, rgbProgram,
		Cube.positionArray(),
		Cube.normalArray(),
		Cube.defaultColorArray(),
		Cube.indexArray(),
	);

	const yellow = new Float32Array([1.0, 1.0, 0.0]);
	var yellowCube = new UniformColorMesh(
		gl, uniformProgram,
		Cube.positionArray(),
		Cube.normalArray(),
		Cube.indexArray(),
		yellow
	);

	const purple = new Float32Array([1.0, 0.0, 1.0]);
	const latBands = 30;
	const longBands = 30;
	var purpleSphere = new UniformColorMesh(
		gl, uniformProgram,
		Sphere.positionArray(latBands, longBands),
		Sphere.normalArray(latBands, longBands),
		Sphere.indexArray(latBands, longBands),
		purple
	);
	purpleSphere.setScale(new Vector(1/Math.cbrt(2), 1/Math.cbrt(2), 1/Math.cbrt(2)));

	// position initial models
	rgbCube.translate(new Vector(0,0,5));
	yellowCube.translate(new Vector(-5,0,0));
	purpleSphere.translate(new Vector(0, 0, -5));


	// ** STEP 1 **
	// Uncomment the radioactiveCrate creation
	// and translation below, and the calls to rotate
	// and draw it in the main, once you've completed
	// Cube.uvRepeateArray()

	// var radioactiveCrate = new UVMesh(
	// 	gl, uvProgram,
	// 	Cube.positionArray(),
	// 	Cube.normalArray(),
	// 	Cube.uvRepeatArray(),
	// 	Cube.indexArray(),
	// 	'radioactive-crate'
	// );
	// radioactiveCrate.translate(new Vector(5,0,0));


	// ** STEP 2 **
	// Uncomment the block below (up to ** STEP 3 **) and the
	// call to "drawTestCubes" in the main once you've finished
	// writing Cube.uvUnwrappedArray()

	// var testCube = new UVMesh(
	// 	gl, uvProgram,
	// 	Cube.positionArray(),
	// 	Cube.normalArray(),
	// 	Cube.uvUnwrappedArray(),
	// 	Cube.indexArray(),
	// 	'unwrappedCube-texture',
	// 	false // flip the image? nah we're using our own uv coords.
	// 	// we'll need to flip it when we import from Blender
	// 	// because WebGL and Blender use opposite UV conventions...
	// );

	// var testPositions = [
	// 	new Vector(-3, 4, 0),
	// 	new Vector(-1, 4, 0),
	// 	new Vector(1,  4, 0),
	// 	new Vector(3,  4, 0),
	// 	new Vector(0,  6, 0),
	// 	new Vector(0,  2, 0),
	// 	new Vector(-3, 3, 2),
	// 	new Vector(3,  3, 2)
	// ];
	// var testRotations = [
	// 	new Quaternion(Math.PI/2, 0, 1, 0),
	// 	new Quaternion(0, 0, 1, 0),
	// 	new Quaternion(-Math.PI/2, 0, 1, 0),
	// 	new Quaternion(-Math.PI, 0, 1, 0),
	// 	new Quaternion(Math.PI/2, 1, 0, 0),
	// 	new Quaternion(-Math.PI/2, 1, 0, 0),
	// 	new Quaternion(),
	// 	new Quaternion()
	// ];

	// var drawTestCubes = function()
	// {
	// 	testRotations[6].compose(yRotSlow);
	// 	testRotations[7].compose(xRotSlow);
	// 	for (var i = 0; i < testPositions.length; i++)
	// 	{
	// 		testCube.setPosition(testPositions[i]);
	// 		testCube.setRotation(testRotations[i]);
	// 		testCube.draw();
	// 	}
	// }


	// ** STEP 3 **
	// Uncomment the earth creation below and the lines to
	// rotate and draw it in the main once you've finished
	// writing Sphere.uvArray()

	// var earth = new UVMesh(
	// 	gl, uvProgram,
	// 	Sphere.positionArray(30, 30),
	// 	Sphere.normalArray(30, 30),
	// 	Sphere.uvArray(30, 30),
	// 	Sphere.indexArray(30, 30),
	// 	'earth-texture'
	// );

	// constants for movement
	var angle = Math.PI / 200;
	var origin = new Vector();
	var yRotSlow = new Quaternion(angle, 0, 1, 0);
	var yRotFast = new Quaternion(angle*3, 0, 1, 0)
	var xRotSlow = new Quaternion(angle, 1, 0, 0);
	var xRotFast = new Quaternion(angle*3, 1, 0, 0)
	var zRot = new Quaternion(angle*3, 0, 0, 1);

	var main = function()
	{
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		rgbCube.rotateAround(origin, yRotSlow);
		rgbCube.localRotate(xRotFast);
		rgbCube.draw();

		yellowCube.rotateAround(origin, yRotSlow);
		yellowCube.localRotate(zRot);
		yellowCube.draw();

		purpleSphere.rotateAround(origin, yRotSlow);
		purpleSphere.localRotate(xRotFast);
		purpleSphere.draw();

		// ** STEP 1 ** See intructions above
		// radioactiveCrate.rotateAround(origin, yRotSlow);
		// radioactiveCrate.localRotate(zRot);
		// radioactiveCrate.draw();

		//** STEP 2 ** See instructions above
		// drawTestCubes();

		// ** STEP 3 ** See instructions above
		// earth.rotate(yRotSlow);
		// earth.draw();

		requestAnimationFrame(main);
	}
	requestAnimationFrame(main);
}

var InitDemo = function()
{
	var imports = [
		['uvVertexShaderText', './shaders/vert.uv.glsl'],
		['uvFragShaderText', './shaders/frag.uv.glsl'],
		['rgbVertexShaderText', './shaders/vert.rgb.glsl'],
		['rgbFragShaderText', './shaders/frag.rgb.glsl'],
		['uniformVertexShaderText', './shaders/vert.uniform.glsl'],
		['uniformFragShaderText', './shaders/frag.uniform.glsl']
	];
	
	var importer = new resourceImporter(imports, RunDemo);
}
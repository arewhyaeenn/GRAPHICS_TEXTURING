var RunDemo = function (filemap)
{
	console.log("Initializing Demo");

	// get canvas, set dimensions to fill browser window
	const canvas = document.getElementById('the_canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// get WebGL context, confirm...
	const gl = canvas.getContext('webgl');

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
	const uvProgram = createShader(
		gl, 
		filemap['uvVertexShaderText'],
		filemap['uvFragShaderText']
	);

	const rgbProgram = createShader(
		gl, 
		filemap['rgbVertexShaderText'],
		filemap['rgbFragShaderText']
	);

	const uniformProgram = createShader(
		gl,
		filemap['uniformVertexShaderText'],
		filemap['uniformFragShaderText']
	);

	// ** STEP 4 **
	// const uvBumpProgram = createShader(
	// 	gl,
	// 	filemap['uvBumpVertexShaderText'],
	// 	filemap['uvBumpFragShaderText']
	// );

	const shaders = [
		uvProgram,
		rgbProgram,
		uniformProgram,
		// uvBumpProgram  // ** STEP 4 **
	];

	// camera
	const viewMatrix = new Float32Array(16);
	const cameraPosition = [0,7,15];
	const lookAtPosition = [0,2,0];
	const cameraUpDirection = [0,1,0];
	mat4.lookAt(
		viewMatrix,       // target matrix to apply values to
		cameraPosition,   // where is the camera
		lookAtPosition,   // what point is the camera looking at
		cameraUpDirection // which direction is upward from the cameras PoV
	);

	const projMatrix = new Float32Array(16);
	const fieldOfView = Math.PI / 4;
	const aspect = canvas.width / canvas.height;
	const near = 0.01;
	const far = 1000.0;
	mat4.perspective(
		projMatrix,  // target matrix
		fieldOfView, // vertical field of view, in radians
		aspect,      // aspect ratio
		near,        // distance to near clip plane
		far          // distance to far clip plane
	);

	// light
	const ambientLight = [0.2, 0.2, 0.2];
	const lightDirection = [1, -0.5, -1];
	const lightIntensity = [1.0, 1.0, 1.0];

	// apply light and camera to shaders
	for (let i = 0; i < shaders.length; i++)
	{
		const shader = shaders[i];

		gl.useProgram(shader);

		const matViewUniformLocation = gl.getUniformLocation(shader, 'mView');
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

		const matProjUniformLocation = gl.getUniformLocation(shader, 'mProj');
		gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	
		const ambientLightUniformLocation = gl.getUniformLocation(shader, 'ambientLight');
		gl.uniform3fv(ambientLightUniformLocation, ambientLight);

		const lightDirectionUniformLocation = gl.getUniformLocation(shader, 'lightDirection');
		const lightIntensityUniformLocation = gl.getUniformLocation(shader, 'lightIntensity');
		gl.uniform3fv(lightDirectionUniformLocation, lightDirection);
		gl.uniform3fv(lightIntensityUniformLocation, lightIntensity);
	}

	// initial models

	const rgbCube = new RGBMesh(
		gl, rgbProgram,
		Cube.positionArray(),
		Cube.normalArray(),
		Cube.defaultColorArray(),
		Cube.indexArray(),
	);

	const yellow = new Float32Array([1.0, 1.0, 0.0]);
	const yellowCube = new UniformColorMesh(
		gl, uniformProgram,
		Cube.positionArray(),
		Cube.normalArray(),
		Cube.indexArray(),
		yellow
	);

	const purple = new Float32Array([1.0, 0.0, 1.0]);
	const latBands = 30;
	const longBands = 30;
	const purpleSphere = new UniformColorMesh(
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
	// Cube.uvRepeatArray()

	// const radioactiveCrate = new UVMesh(
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

	// const testCube = new UVMesh(
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

	// const testPositions = [
	// 	new Vector(-3, 4, 0),
	// 	new Vector(-1, 4, 0),
	// 	new Vector(1,  4, 0),
	// 	new Vector(3,  4, 0),
	// 	new Vector(0,  6, 0),
	// 	new Vector(0,  2, 0),
	// 	new Vector(-3, 3, 2),
	// 	new Vector(3,  3, 2)
	// ];
	// const testRotations = [
	// 	new Quaternion(Math.PI/2, 0, 1, 0),
	// 	new Quaternion(0, 0, 1, 0),
	// 	new Quaternion(-Math.PI/2, 0, 1, 0),
	// 	new Quaternion(-Math.PI, 0, 1, 0),
	// 	new Quaternion(Math.PI/2, 1, 0, 0),
	// 	new Quaternion(-Math.PI/2, 1, 0, 0),
	// 	new Quaternion(),
	// 	new Quaternion()
	// ];

	// const drawTestCubes = function()
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


	// ** STEP 3 ** OPTIONAL
	// Uncomment the earth creation below and the lines to
	// rotate and draw it in the main once you've finished
	// writing Sphere.uvArray()

	// const earth = new UVMesh(
	// 	gl, uvProgram,
	// 	Sphere.positionArray(30, 30),
	// 	Sphere.normalArray(30, 30),
	// 	Sphere.uvArray(30, 30),
	// 	Sphere.indexArray(30, 30),
	// 	'earth-texture'
	// );

	// ** STEP 4 **
	// Create a shader which takes a second texture
	// (the normal map) and a corresponding extension
	// to the UVMesh class called "BumpUVMesh".
	// Add your shader to the imports at the bottom,
	// create the shader where the others are created above
	// (search for createShader), add your new shader to the
	// list of shaders, and uncomment the lines below
	// for the bumpy cube creation, as well as the lines
	// in the main to draw and rotate it.

	// const bumpyCube = new BumpUVMesh(
	// 	gl, uvBumpProgram,
	// 	Cube.positionArray(),
	// 	Cube.normalArray(),
	// 	Cube.uvRepeatArray(),
	// 	Cube.indexArray(),
	// 	'bumpy-texture',
	// 	'bumpy-normal'
	// );
	// bumpyCube.setPosition(new Vector(-0.5, 7, 13));
	// bumpyCube.setScale(new Vector(0.5, 0.5, 0.5));

	// constants for movement
	const angle = Math.PI / 200;
	const origin = new Vector();
	const yRotSlow = new Quaternion(angle, 0, 1, 0);
	const yRotFast = new Quaternion(angle*3, 0, 1, 0)
	const xRotSlow = new Quaternion(angle, 1, 0, 0);
	const xRotFast = new Quaternion(angle*3, 1, 0, 0)
	const zRot = new Quaternion(angle*3, 0, 0, 1);
	const rotSoSlow = new Quaternion(angle / 5, 1, 0.5, 1);

	const main = function()
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

		// ** STEP 4 ** See instructions above
		// bumpyCube.rotate(rotSoSlow);
		// bumpyCube.draw();

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
		['uniformFragShaderText', './shaders/frag.uniform.glsl'],
		['uvBumpVertexShaderText', './shaders/vert.uvbump.glsl'],
		['uvBumpFragShaderText', './shaders/frag.uvbump.glsl']
	];
	
	var importer = new resourceImporter(imports, RunDemo);
}
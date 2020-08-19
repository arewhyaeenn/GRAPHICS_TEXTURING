var createShader = function(gl, vertShaderText, fragShaderText)
{
	let vertShader = gl.createShader(gl.VERTEX_SHADER);
	let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(vertShader, vertShaderText);
	gl.shaderSource(fragShader, fragShaderText);
	gl.compileShader(vertShader);
	if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
	{
		console.error("Cannot compile vertex shader.", gl.getShaderInfoLog(vertShader));
		return null;
	}
	gl.compileShader(fragShader);
	if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
	{
		console.error("Cannot compile fragment shader.", gl.getShaderInfoLog(fragShader));
		return null;
	}
	var program = gl.createProgram();
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		console.error("Cannot link GL program.", gl.getProgramInfoLog(program));
		return null;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
	{
		console.error("Cannot validate GL program.", gl.getProgramInfoLog(program));
		return null;
	}
	return program;
}
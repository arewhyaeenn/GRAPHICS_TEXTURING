class UVMesh extends Mesh
{
	constructor(gl, program, positionArray, normalArray, texCoordArray, indexArray, imageID, flipTexture, position=new Vector(), rotation=new Quaternion(), scale=new Vector(1,1,1))
	{
		super(gl, program, positionArray, normalArray, indexArray, position, rotation, scale);

		this.texCoordAttribLocation = gl.getAttribLocation(this.program, 'vertTexCoord');

		this.texCoordBuffer = gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoordArray, this.gl.STATIC_DRAW);
		this.gl.bindBuffer(gl.ARRAY_BUFFER, null);

		this.texture = gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flipTexture);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			0,
			this.gl.RGBA,
			this.gl.RGBA,
			this.gl.UNSIGNED_BYTE,
			document.getElementById(imageID)
		);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}

	activate()
	{
		super.activate();

		this.gl.enableVertexAttribArray(this.texCoordAttribLocation);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.gl.vertexAttribPointer(
			this.texCoordAttribLocation,
			2,
			this.gl.FLOAT,
			this.gl.FALSE,
			2 * Float32Array.BYTES_PER_ELEMENT,
			0
		);
	}

	deactivate()
	{
		super.deactivate();
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}
}
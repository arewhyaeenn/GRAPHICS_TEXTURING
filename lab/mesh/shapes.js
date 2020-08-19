class Cube
{
	static positionArray()
	{
		return new Float32Array([
			// top (+y)
			-0.5, 0.5, -0.5,
			-0.5, 0.5, 0.5,
			0.5,  0.5, 0.5,
			0.5,  0.5, -0.5,

			// bottom (-y)
			-0.5, -0.5, 0.5,
			-0.5, -0.5, -0.5,
			0.5,  -0.5, -0.5,
			0.5,  -0.5, 0.5,

			// left (-x)
			-0.5, 0.5,  -0.5,
			-0.5, -0.5, -0.5,
			-0.5, -0.5, 0.5,
			-0.5, 0.5,  0.5,

			// right (+x)
			0.5, 0.5,  0.5,
			0.5, -0.5, 0.5,
			0.5, -0.5, -0.5,
			0.5, 0.5,  -0.5,

			// back (-z)
			0.5,  0.5,  -0.5,
			0.5,  -0.5, -0.5,
			-0.5, -0.5, -0.5,
			-0.5, 0.5,  -0.5,

			// front (+z)
			-0.5, 0.5,  0.5,
			-0.5, -0.5, 0.5,
			0.5,  -0.5, 0.5,
			0.5,  0.5,  0.5
		]);
	}

	static normalArray()
	{
		return new Float32Array([	
			// top
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,

			// bottom
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,

			// left
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,

			// right
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			// back
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			// front
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		]);
	}

	static defaultColorArray()
	{
		return new Float32Array([
			// top / bottom is green
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,

			// left / right is red
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
	 		1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
	 		1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,

			// front / back is blue
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
	 		0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,

			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
	 		0.0, 0.0, 1.0,
			0.0, 0.0, 1.0
		]);
	}

	static uvRepeatArray()
	{
		// TODO
		// Write UV coords matching the positions array
		// to map every face to the entirety of an image
		// (each face displays the whole image).
	}

	static uvUnwrappedArray()
	{
		// TODO
		// Write UV coords matching the positions array
		// to map vertices to the provided unwrapped cube texture
	}

	static indexArray()
	{
		return new Uint16Array([
			// top
			0, 1, 2,
			0, 2, 3,
			// bottom
			4, 5, 6,
			4, 6, 7,
			// right
			8, 9, 10,
			8, 10, 11,
			// left
			12, 13, 14,
			12, 14, 15,
			// back
			16, 17, 18,
			16, 18, 19,
			// front
			20, 21, 22,
			20, 22, 23
		]);
	}
}

class Sphere
{
	static positionArray(latBands, longBands)
	{
		var pos = [];
		for (var lat = 0; lat <= latBands; lat++)
		{
			var theta = lat * Math.PI / latBands;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			for (var long = 0; long <= longBands; long++)
			{
				var phi = long * 2 * Math.PI / longBands;
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);

				var x = sinTheta * sinPhi;
				var y = cosTheta;
				var z = sinTheta * cosPhi; 

				pos.push(x);
				pos.push(y);
				pos.push(z);
			}
		}
		return new Float32Array(pos);
	}

	static normalArray(latBands, longBands)
	{
		return Sphere.positionArray(latBands, longBands);
	}

	static uvArray(latBands, longBands)
	{
		// TODO
		// Map the sphere to the sphereical texture.
		// Each latitude band spans the entire width of the picture.
		// Must match the position array; read through it first.
		// It goes from top to bottom, in counterclockwise circles
		// (counterclockwise if viewed from above)
	}

	static indexArray(latBands, longBands)
	{
		var ind = [];
		for (var lat = 0; lat < latBands; lat++)
		{
			for (var long = 0; long < longBands; long++)
			{
				var topLeftIndex = lat * (longBands + 1) + long;
				var topRightIndex = topLeftIndex + 1;
				var bottomLeftIndex = topLeftIndex + longBands + 1;
				var bottomRightIndex = bottomLeftIndex + 1;

				// top left triangle
				ind.push(topLeftIndex);
				ind.push(bottomLeftIndex);
				ind.push(topRightIndex);

				// bottom right triangle
				ind.push(bottomLeftIndex);
				ind.push(bottomRightIndex);
				ind.push(topRightIndex);
			}
		}
		return new Uint16Array(ind);
	}
}
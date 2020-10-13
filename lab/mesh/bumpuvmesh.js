class BumpUVMesh extends UVMesh
{
	constructor(gl, program, positionArray, normalArray, texCoordArray, indexArray, imageID, normalMapID, flipTexture, position=new Vector(), rotation=new Quaternion(), scale=new Vector(1,1,1))
	{
		super(gl, program, positionArray, normalArray, texCoordArray, indexArray, imageID, flipTexture, position, rotation, scale);

		const tangentArray = BumpUVMesh.createTangentArray(positionArray, texCoordArray, normalArray, indexArray);

		// TODO 
		// set up tangent attribute location and buffer 
		// (called 'vertTangent' in shader)

		// TODO
		// set up the normal map texture (see UVMesh texture setup)
		// get the normal map's uniform location
		// (called 'normalMap' in shader)
	}

	activate()
	{
		super.activate();

		// TODO
		// prepare tangent attribute for drawing
		// (enable attrib array, bind buffer, ...)

		// TODO set up normal map for use in texture slot 1
	}

	deactivate()
	{
		super.deactivate();

		// TODO
		// disable tangent attribute array
	}

	/*
		Assumes: 

			- if a vertex is repeated in mutliple faces, the faces
			  have the tangent space (first face's tangent space will
			  be used). This should be the case in general.
			- positionArray has 3v elements (3 for each vertex)
			- uvArray has 2v elements (2 for each vertex)
			- index has 3n elements (3 for each face, drawing triangles)
			- arrays are cohesive

		If this crashes, it is most likely because there aren't 3n
		elements in the index array.
	*/
	static createTangentArray(positionArray, uvArray, normalArray, indexArray)
	{
		const tangentDict = {};

		for (let t = 0; 3*t < indexArray.length; t++)
		{
			const vert_index_1 = indexArray[3*t];
			const vert_index_2 = indexArray[3*t+1];
			const vert_index_3 = indexArray[3*t+2];

			const pos_index_1 = 3 * vert_index_1;
			const pos_index_2 = 3 * vert_index_2;
			const pos_index_3 = 3 * vert_index_3;

			const pos_1_x = positionArray[pos_index_1];
			const pos_1_y = positionArray[pos_index_1+1];
			const pos_1_z = positionArray[pos_index_1+2];

			const pos_2_x = positionArray[pos_index_2];
			const pos_2_y = positionArray[pos_index_2+1];
			const pos_2_z = positionArray[pos_index_2+2];

			const pos_3_x = positionArray[pos_index_3];
			const pos_3_y = positionArray[pos_index_3+1];
			const pos_3_z = positionArray[pos_index_3+2];

			const uv_index_1 = 2 * vert_index_1;
			const uv_index_2 = 2 * vert_index_2;
			const uv_index_3 = 2 * vert_index_3;

			const uv_1_x = uvArray[uv_index_1];
			const uv_1_y = uvArray[uv_index_1+1];

			const uv_2_x = uvArray[uv_index_2];
			const uv_2_y = uvArray[uv_index_2+1];

			const uv_3_x = uvArray[uv_index_3];
			const uv_3_y = uvArray[uv_index_3+1];

			const edge_1_x = pos_2_x - pos_1_x;
			const edge_1_y = pos_2_y - pos_1_y;
			const edge_1_z = pos_2_z - pos_1_z;

			const edge_2_x = pos_3_x - pos_1_x;
			const edge_2_y = pos_3_y - pos_1_y;
			const edge_2_z = pos_3_z - pos_1_z;

			const deltaUV_1_x = uv_2_x - uv_1_x;
			const deltaUV_1_y = uv_2_y - uv_1_y;

			const deltaUV_2_x = uv_3_x - uv_1_x;
			const deltaUV_2_y = uv_3_y - uv_1_y;

			const f = 1.0 / (deltaUV_1_x * deltaUV_2_y - deltaUV_1_y * deltaUV_2_x);

			const t_x = f * (edge_1_x * deltaUV_2_y - edge_2_x * deltaUV_1_y);
			const t_y = f * (edge_1_y * deltaUV_2_y - edge_2_y * deltaUV_1_y);
			const t_z = f * (edge_1_z * deltaUV_2_y - edge_2_z * deltaUV_1_y);

			const tangent = new Vector(t_x, t_y, t_z);
			tangent.normalize();
			for (const index of [vert_index_1, vert_index_2, vert_index_3])
			{
				if (! (index in tangentDict))
				{
					tangentDict[index] = [];
				}
				tangentDict[index].push(tangent);
			}
		}

		const tangentArray = new Float32Array(positionArray.length);
		const bitangentArray = new Float32Array(positionArray.length);
		for (let vert_index = 0; 3*vert_index < positionArray.length; vert_index++)
		{
			const tangent = Vector.average(tangentDict[vert_index]);
			const normal = new Vector(
				normalArray[3*vert_index],
				normalArray[3*vert_index+1],
				normalArray[3*vert_index+2]
			);
			normal.normalize();
			
			const projection = Vector.copy(normal);
			const projectionScale = Vector.dot(normal, tangent);
			projection.scale(new Vector(projectionScale, projectionScale, projectionScale));
			tangent.subtract(projection);
			tangent.normalize();
			
			tangentArray[3*vert_index] = tangent.x;
			tangentArray[3*vert_index+1] = tangent.y;
			tangentArray[3*vert_index+2] = tangent.z;
		}
		return tangentArray;
	}
}
precision mediump float;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat3 mNormal;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal;
attribute vec3 vertTangent;

varying vec2 fragTexCoord;
varying mat3 mTangent;

void main()
{
	fragTexCoord = vertTexCoord;

	// TODO calculate tangent vector in world space by applying mWorld
	// to the vertTangent. Keep the xyz components of the result.
	// HINT: vertTangent is a vec3 denoting a direction; should its
	// 		 "extra" component be 0.0 or 1.0?

	// TODO calculate the normal vector in world space by applying
	// mNormal to vertNormal.

	// TODO calculate the bitangent vector by taking the cross product
	// of the normal and the tangent

	// TODO assign mTangent mat3; give it three vec3 (tangent,
	// bitangent, and normal) as its column vectors.

	gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
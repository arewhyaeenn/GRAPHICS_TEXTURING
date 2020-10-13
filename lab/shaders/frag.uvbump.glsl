precision mediump float;

uniform sampler2D texture;
uniform sampler2D normalMap;

uniform vec3 ambientLight;
uniform vec3 lightDirection;
uniform vec3 lightIntensity;

varying vec2 fragTexCoord;
varying mat3 mTangent;

void main()
{
	// TODO get fragNormal from normalMap (use only rgb components)
	// TODO convert fragNormal to [-1, 1] interval from [0, 1] interval
	// TODO apply mTangent to fragNormal
	// the resulting fragNormal is used below in the light calculation

	vec4 texel = texture2D(texture, fragTexCoord);
	vec3 light = ambientLight + lightIntensity * max( -dot( fragNormal,normalize(lightDirection) ), 0.0);
	
	gl_FragColor = vec4(texel.rgb * light, texel.a);
}
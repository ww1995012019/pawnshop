shader_type canvas_item;
render_mode unshaded;

uniform vec4 region = vec4(0.0, 0.0, 1.0, 1.0);
uniform float nod : hint_range(0.0, 1.0) = 0.0;
varying vec4 tint;

void vertex() {
	tint = COLOR;
}

void fragment() {
	vec2 local = (UV - region.xy) / region.zw;
	// The head dips into the scarf. The shoulders, hands and counter stay put.
	float head = (1.0 - smoothstep(0.31, 0.55, local.y))
		* (1.0 - smoothstep(0.23, 0.40, abs(local.x - 0.50)));
	local.y -= 0.045 * head * nod;
	local.x -= 0.007 * head * nod;
	vec4 paint = texture(TEXTURE, region.xy + clamp(local, vec2(0.0), vec2(1.0)) * region.zw);
	COLOR = (local.y < 0.0 ? vec4(0.0) : paint) * tint;
}

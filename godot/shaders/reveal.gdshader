// Text that only fluoresces where the UV wand points (world-space distance).
shader_type canvas_item;
uniform vec2 uv_pos = vec2(-9999.0);
uniform float uv_r = 0.0;
uniform float found = 0.0;
varying vec2 world;
void vertex() { world = (MODEL_MATRIX * vec4(VERTEX, 0.0, 1.0)).xy; }
void fragment() {
	vec4 c = texture(TEXTURE, UV) * COLOR;
	float lit = uv_r > 0.0 ? 1.0 - smoothstep(uv_r * 0.35, uv_r * 0.85, distance(world, uv_pos)) : 0.0;
	float flick = 0.85 + 0.15 * sin(TIME * 31.0) * sin(TIME * 7.0);
	COLOR = vec4(c.rgb, c.a * max(lit * flick, found * 0.0));
}

// Text that only fluoresces where the UV wand points (world-space distance).
shader_type canvas_item;
uniform vec2 uv_pos = vec2(-9999.0);
uniform float uv_r = 0.0;
uniform float found = 0.0;
varying vec2 world;
void vertex() { world = (MODEL_MATRIX * vec4(VERTEX, 0.0, 1.0)).xy; }
void fragment() {
	vec4 c = texture(TEXTURE, UV) * COLOR;
	float lit = uv_r > 0.0 ? 1.0 - smoothstep(uv_r * 0.28, uv_r * 0.95, length((world - uv_pos) * vec2(1.0, 1.6))) : 0.0;
	float flick = 1.0;
	COLOR = vec4(c.rgb, c.a * max(lit * flick, found * 0.0));
}

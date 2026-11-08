// CRT read-out: barrel curvature, scanlines, phosphor bloom, flicker, vignette.
shader_type canvas_item;
uniform float curve = 0.12;
uniform vec3 tint = vec3(1.0, 0.92, 0.82);
vec2 bend(vec2 uv) {
	vec2 c = uv * 2.0 - 1.0;
	c *= 1.0 + curve * dot(c.yx, c.yx) * 0.25;
	return c * 0.5 + 0.5;
}
void fragment() {
	vec2 uv = bend(UV);
	if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { COLOR = vec4(0.02, 0.03, 0.03, 1.0); }
	else {
		vec2 px = TEXTURE_PIXEL_SIZE;
		vec3 c = texture(TEXTURE, uv).rgb;
		vec3 glow = vec3(0.0);
		for (int i = -2; i <= 2; i++) for (int j = -2; j <= 2; j++)
			glow += texture(TEXTURE, uv + vec2(float(i), float(j)) * px * 2.5).rgb;
		glow /= 25.0;
		c = c + glow * 0.9;
		float scan = 0.82 + 0.18 * sin(uv.y / px.y * 3.1416);
		float roll = 0.96 + 0.04 * sin(uv.y * 8.0 - TIME * 3.0);
		float flick = 0.97 + 0.03 * sin(TIME * 53.0);
		vec2 v = uv * (1.0 - uv);
		float vig = clamp(pow(v.x * v.y * 18.0, 0.35), 0.0, 1.0);
		c *= scan * roll * flick * vig * tint;
		c += vec3(0.02, 0.05, 0.045);
		COLOR = vec4(c, 1.0);
	}
}

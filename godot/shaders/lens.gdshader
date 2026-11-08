// Jeweller's loupe: magnifies what is already on screen, with a refracting rim,
// slight chromatic fringe and a glass highlight. The lens centre in screen space
// is recovered from screen-space derivatives, so camera zoom and window stretch
// need no extra uniforms.
shader_type canvas_item;
uniform sampler2D screen_tex : hint_screen_texture, filter_linear_mipmap;
uniform float zoom = 2.2;

void fragment() {
	vec2 c = UV - 0.5;
	float r = length(c) * 2.0;
	if (r > 1.0) discard;
	vec2 k = vec2(dFdx(SCREEN_UV.x) / dFdx(UV.x), dFdy(SCREEN_UV.y) / dFdy(UV.y));
	vec2 center = SCREEN_UV - c * k;
	vec2 suv = center + (SCREEN_UV - center) / zoom;
	float rim = smoothstep(0.78, 1.0, r);
	// Barrel bend toward the rim reads as thick glass.
	suv += (SCREEN_UV - center) * rim * 0.35 / zoom;
	vec2 fringe = normalize(c + 1e-5) * rim * 0.004;
	vec3 col = vec3(texture(screen_tex, suv + fringe).r, texture(screen_tex, suv).g, texture(screen_tex, suv - fringe).b);
	col *= 1.1;
	float sheen = (1.0 - smoothstep(0.0, 0.32, length(c - vec2(-0.17, -0.2)))) * 0.16;
	col += vec3(sheen);
	col = mix(col, col * 0.3, rim * 0.8);
	float ring = smoothstep(0.92, 0.95, r);
	col = mix(col, vec3(0.72, 0.55, 0.32) * (0.75 + 0.35 * (1.0 - UV.y)), ring);
	COLOR = vec4(col, 1.0);
}

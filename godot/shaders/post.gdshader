// Full-screen finish: vignette, warm/cool split, faint grain.
shader_type canvas_item;
uniform sampler2D screen_tex : hint_screen_texture, filter_linear_mipmap;
uniform float dark = 0.0; // UV mode darkening handled by lights; this adds mood
void fragment() {
	vec3 c = texture(screen_tex, SCREEN_UV).rgb;
	vec2 p = SCREEN_UV - 0.5;
	float vig = 1.0 - smoothstep(0.35, 0.85, length(p * vec2(1.0, 1.25)));
	c *= mix(0.55, 1.0, vig);
	float l = dot(c, vec3(0.3, 0.59, 0.11));
	c = mix(c, c * vec3(1.05, 0.98, 0.92), smoothstep(0.4, 0.9, l));
	c = mix(c, c * vec3(0.92, 0.98, 1.08), 1.0 - smoothstep(0.05, 0.35, l));
	float g = fract(sin(dot(SCREEN_UV * vec2(1920.0, 1080.0) + TIME * 61.0, vec2(12.9898, 78.233))) * 43758.5453);
	c += (g - 0.5) * 0.025;
	COLOR = vec4(c, 1.0);
}

// Physical item: normal-mapped paint plus two hidden layers that only appear
// under the instruments — fine scratches and a repaint seam under the loupe,
// fluorescent residue under the UV wand.
shader_type canvas_item;

uniform vec2 lens_pos = vec2(-9999.0);
uniform float lens_r = 0.0;
uniform vec2 uv_pos = vec2(-9999.0);
uniform float uv_r = 0.0;
uniform vec2 seam_uv = vec2(0.62, 0.52);  // where the repaint seam is
uniform float back_face = 0.0;
uniform float hover = 0.0;
uniform float found_seam = 0.0;
uniform vec4 region = vec4(0.0, 0.0, 1.0, 1.0); // atlas UV rect of this face
uniform float grime = 0.0;            // repair: dirt still to scrub off
uniform sampler2D grime_mask : filter_linear;

varying vec2 world;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float scratches(vec2 uv) {
	float s = 0.0;
	for (int i = 0; i < 9; i++) {
		float fi = float(i);
		vec2 o = vec2(hash(vec2(fi, 1.3)), hash(vec2(fi, 7.1)));
		float ang = hash(vec2(fi, 3.7)) * 3.1416;
		vec2 dir = vec2(cos(ang), sin(ang));
		vec2 q = uv - o;
		float along = dot(q, dir);
		float across = abs(dot(q, vec2(-dir.y, dir.x)));
		float len = 0.05 + hash(vec2(fi, 9.9)) * 0.12;
		s += (1.0 - smoothstep(0.0, 0.0022, across)) * (1.0 - smoothstep(len * 0.6, len, abs(along)));
	}
	return clamp(s, 0.0, 1.0);
}

void vertex() {
	world = (MODEL_MATRIX * vec4(VERTEX, 0.0, 1.0)).xy;
}

void fragment() {
	vec4 base = COLOR;
	float a = base.a;
	vec2 luv = (UV - region.xy) / region.zw;
	// Loupe: micro-scratches everywhere, a bright repaint seam near seam_uv.
	float in_lens = lens_r > 0.0 ? 1.0 - smoothstep(lens_r * 0.85, lens_r, distance(world, lens_pos)) : 0.0;
	float sc = scratches(luv * 1.6) * in_lens;
	float seam_line = 1.0 - smoothstep(0.0, 0.006, abs((luv.x - seam_uv.x) * 0.8 + (luv.y - seam_uv.y) * 0.6));
	float seam_zone = 1.0 - smoothstep(0.05, 0.16, distance(luv, seam_uv));
	float seam = seam_line * seam_zone * max(in_lens, found_seam * 0.55) * (1.0 - back_face);
	base.rgb = mix(base.rgb, vec3(0.95, 0.92, 0.85), sc * 0.55 * a);
	base.rgb = mix(base.rgb, vec3(1.0, 0.62, 0.25), seam * a);
	// UV wand: fluorescent residue speckles on the repainted belly.
	float in_uv = uv_r > 0.0 ? 1.0 - smoothstep(uv_r * 0.5, uv_r, distance(world, uv_pos)) : 0.0;
	float speck = step(0.985, hash(floor(luv * 140.0))) * in_uv;
	base.rgb += vec3(0.35, 1.0, 0.75) * speck * a * 0.9;
	base.rgb += vec3(0.25, 0.12, 0.45) * in_uv * a * 0.15;
	base.rgb += vec3(1.0, 0.85, 0.6) * hover * 0.06 * a;
	// Grime layer for the repair bench: brown film where the mask is still dirty.
	if (grime > 0.0) {
		float m = texture(grime_mask, luv).r * grime;
		float n = hash(floor(luv * 90.0)) * 0.35 + 0.65;
		base.rgb = mix(base.rgb, vec3(0.32, 0.25, 0.17) * n, m * 0.82 * a);
	}
	COLOR = vec4(base.rgb, a);
}

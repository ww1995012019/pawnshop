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
// Physical instance marks stay unreadable until a current loupe observation.
// Catalogue/reference art does not use this material or enable this mask.
uniform float logo_hidden = 0.0;
uniform vec4 logo_rect = vec4(0.0);
uniform float hover = 0.0;
uniform float found_seam = 0.0;
uniform vec4 region = vec4(0.0, 0.0, 1.0, 1.0); // atlas UV rect of this face
uniform float grime = 0.0;            // repair: dirt still to scrub off
uniform sampler2D grime_mask : filter_linear;
// Original sprite regions may move as separate inspection parts.
uniform vec4 inspection_mask_0 = vec4(0.0);
uniform vec4 inspection_mask_1 = vec4(0.0);
uniform vec4 inspection_mask_2 = vec4(0.0);
uniform float inspection_mask_0_on = 0.0;
uniform float inspection_mask_1_on = 0.0;
uniform float inspection_mask_2_on = 0.0;
// Two shaped cutouts for independent parts which cannot be isolated by a box.
uniform float inspection_poly_0_on = 0.0;
uniform vec4 inspection_poly_0_a = vec4(0.0);
uniform vec4 inspection_poly_0_b = vec4(0.0);
uniform vec4 inspection_poly_0_c = vec4(0.0);
uniform vec4 inspection_poly_0_d = vec4(0.0);
uniform vec4 inspection_poly_0_e = vec4(0.0);
uniform vec4 inspection_poly_0_f = vec4(0.0);
uniform vec4 inspection_poly_0_g = vec4(0.0);
uniform vec4 inspection_poly_0_h = vec4(0.0);
uniform float inspection_poly_1_on = 0.0;
uniform vec4 inspection_poly_1_a = vec4(0.0);
uniform vec4 inspection_poly_1_b = vec4(0.0);
uniform vec4 inspection_poly_1_c = vec4(0.0);
uniform vec4 inspection_poly_1_d = vec4(0.0);
uniform vec4 inspection_poly_1_e = vec4(0.0);
uniform vec4 inspection_poly_1_f = vec4(0.0);
uniform vec4 inspection_poly_1_g = vec4(0.0);
uniform vec4 inspection_poly_1_h = vec4(0.0);

varying vec2 world;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

bool inside_inspection_poly(vec2 point, vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h) {
	vec2 vertices[16];
	vertices[0] = a.xy; vertices[1] = a.zw;
	vertices[2] = b.xy; vertices[3] = b.zw;
	vertices[4] = c.xy; vertices[5] = c.zw;
	vertices[6] = d.xy; vertices[7] = d.zw;
	vertices[8] = e.xy; vertices[9] = e.zw;
	vertices[10] = f.xy; vertices[11] = f.zw;
	vertices[12] = g.xy; vertices[13] = g.zw;
	vertices[14] = h.xy; vertices[15] = h.zw;
	bool inside = false;
	vec2 previous = vertices[15];
	for (int i = 0; i < 16; i++) {
		vec2 current = vertices[i];
		if ((current.y > point.y) != (previous.y > point.y)) {
			float crossing = (previous.x - current.x) * (point.y - current.y) / (previous.y - current.y) + current.x;
			if (point.x < crossing) inside = !inside;
		}
		previous = current;
	}
	return inside;
}

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
	if (inspection_mask_0_on > 0.5 && all(greaterThanEqual(luv, inspection_mask_0.xy)) && all(lessThan(luv, inspection_mask_0.xy + inspection_mask_0.zw))) a = 0.0;
	if (inspection_mask_1_on > 0.5 && all(greaterThanEqual(luv, inspection_mask_1.xy)) && all(lessThan(luv, inspection_mask_1.xy + inspection_mask_1.zw))) a = 0.0;
	if (inspection_mask_2_on > 0.5 && all(greaterThanEqual(luv, inspection_mask_2.xy)) && all(lessThan(luv, inspection_mask_2.xy + inspection_mask_2.zw))) a = 0.0;
	if (inspection_poly_0_on > 0.5 && all(greaterThanEqual(luv, inspection_mask_0.xy)) && all(lessThan(luv, inspection_mask_0.xy + inspection_mask_0.zw)) && inside_inspection_poly(luv, inspection_poly_0_a, inspection_poly_0_b, inspection_poly_0_c, inspection_poly_0_d, inspection_poly_0_e, inspection_poly_0_f, inspection_poly_0_g, inspection_poly_0_h)) a = 0.0;
	if (inspection_poly_1_on > 0.5 && all(greaterThanEqual(luv, inspection_mask_1.xy)) && all(lessThan(luv, inspection_mask_1.xy + inspection_mask_1.zw)) && inside_inspection_poly(luv, inspection_poly_1_a, inspection_poly_1_b, inspection_poly_1_c, inspection_poly_1_d, inspection_poly_1_e, inspection_poly_1_f, inspection_poly_1_g, inspection_poly_1_h)) a = 0.0;
	// Loupe: micro-scratches everywhere, a bright repaint seam near seam_uv.
	float in_lens = lens_r > 0.0 ? 1.0 - smoothstep(lens_r * 0.85, lens_r, distance(world, lens_pos)) : 0.0;
	if (logo_hidden > 0.5 && back_face < 0.5 && all(greaterThanEqual(luv, logo_rect.xy)) && all(lessThan(luv, logo_rect.xy + logo_rect.zw))) {
		// A fixed coarse mosaic hides the shape, rather than downsampling the
		// distinctive mark. Only the circular lens exposes original pixels.
		vec2 tile = floor((luv - logo_rect.xy) / logo_rect.zw * vec2(6.0, 4.0));
		vec3 paper = texture(TEXTURE, region.xy + region.zw * (logo_rect.xy + vec2(0.001))).rgb;
		vec3 mosaic = paper * (0.55 + 0.35 * hash(tile + vec2(17.0, 31.0)));
		base.rgb = mix(mosaic, base.rgb, in_lens);
	}
	float sc = scratches(luv * 1.6) * in_lens;
	float seam_line = 1.0 - smoothstep(0.0, 0.006, abs((luv.x - seam_uv.x) * 0.8 + (luv.y - seam_uv.y) * 0.6));
	float seam_zone = 1.0 - smoothstep(0.05, 0.16, distance(luv, seam_uv));
	float seam = seam_line * seam_zone * max(in_lens, found_seam * 0.55) * (1.0 - back_face);
	base.rgb = mix(base.rgb, vec3(0.95, 0.92, 0.85), sc * 0.55 * a);
	base.rgb = mix(base.rgb, vec3(1.0, 0.62, 0.25), seam * a);
	// UV wand: fluorescent residue speckles on the repainted belly.
	float in_uv = uv_r > 0.0 ? 1.0 - smoothstep(uv_r * 0.28, uv_r, length((world - uv_pos) * vec2(1.0, 1.6))) : 0.0;
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

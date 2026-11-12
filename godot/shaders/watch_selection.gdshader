shader_type canvas_item;
render_mode unshaded;

uniform sampler2D face_texture : filter_linear;
uniform float strength : hint_range(0.0, 1.0) = 0.0;
uniform vec4 region = vec4(0.0, 0.0, 1.0, 1.0);
uniform vec4 gold : source_color = vec4(1.0, 0.72, 0.26, 0.8);

varying float opacity;

void vertex() { opacity = COLOR.a; }

// Sample only this face's atlas region, so neighbouring watches never glow.
float silhouette(vec2 uv) {
	vec2 inside = step(region.xy, uv) * step(uv, region.xy + region.zw);
	return texture(face_texture, clamp(uv, region.xy, region.xy + region.zw)).a * inside.x * inside.y;
}

void fragment() {
	float halo = 0.0;
	for (int i = 0; i < 16; i++) {
		float angle = float(i) * 6.2831853 / 16.0;
		vec2 direction = vec2(cos(angle), sin(angle)) * TEXTURE_PIXEL_SIZE;
		halo += silhouette(UV + direction * 2.0) * 0.65;
		halo += silhouette(UV + direction * 4.0) * 0.35;
	}
	float outside = 1.0 - silhouette(UV);
	COLOR = vec4(gold.rgb, min(0.8, halo / 16.0 * 2.4) * outside * gold.a * strength * opacity);
}

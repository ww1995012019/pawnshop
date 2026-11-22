shader_type canvas_item;

// The desktop slices and the landscape panels share the clean-room atlas.
uniform float after_hours : hint_range(0.0, 1.0) = 0.0;
uniform vec2 shift_lights = vec2(1.0, 0.0);

float berth_light(vec2 pixel, vec2 center) {
	float d = length((pixel - center) * vec2(0.8, 1.25));
	return 0.7 * (1.0 - smoothstep(1.6, 3.8, d)) + 0.19 * (1.0 - smoothstep(2.0, 10.0, d));
}

void fragment() {
	vec2 pixel = UV / TEXTURE_PIXEL_SIZE;
	vec3 paint = COLOR.rgb;
	vec3 night = paint * vec3(0.46, 0.54, 0.68);
	// Take the warm emission out of the painted bulb, keeping the shade's ink.
	vec2 lamp = pixel - vec2(438.0, 181.0);
	lamp.y += lamp.x * 0.15;
	float bulb = 1.0 - smoothstep(0.77, 1.08, length(lamp / vec2(79.0, 19.0)));
	night = mix(night, night * vec3(0.54, 0.67, 0.75), bulb);
	vec3 room = mix(paint, night, after_hours);
	float near_berth = berth_light(pixel, vec2(681.0, 229.0)) + berth_light(pixel, vec2(699.0, 229.0));
	float far_berth = berth_light(pixel, vec2(1009.0, 210.0)) + berth_light(pixel, vec2(1026.0, 210.0));
	room = mix(room, vec3(0.72, 0.91, 0.84), near_berth * mix(0.12, 1.0, shift_lights.x));
	COLOR.rgb = mix(room, vec3(1.0, 0.70, 0.38), far_berth * mix(0.12, 1.0, shift_lights.y));
}

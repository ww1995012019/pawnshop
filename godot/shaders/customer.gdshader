// Procedural "cut-out" rig on a single portrait: the mesh is a grid, and each
// vertex moves by where it sits on the body (head, chest, base), so one painted
// image can breathe, nod, tilt and lean like a rigged puppet.
shader_type canvas_item;

uniform vec2 size = vec2(434.0, 724.0);
uniform float neck = 0.34;      // UV height of the neck pivot
uniform float waist = 0.78;     // below this the body is anchored by the counter
uniform float breath = 0.0;     // -1..1
uniform float head_tilt = 0.0;  // radians
uniform float head_nod = 0.0;   // px, positive = down
uniform float head_turn = 0.0;  // px, sideways shift of the face
uniform float lean = 0.0;       // px at the top of the head
uniform float shrug = 0.0;      // px, shoulders up
uniform float flash = 0.0;      // brief warm highlight on reactions

void vertex() {
	vec2 uv = UV;
	vec2 v = VERTEX;
	float head = 1.0 - smoothstep(neck - 0.05, neck + 0.07, uv.y);
	float torso = smoothstep(neck - 0.08, neck + 0.12, uv.y) * (1.0 - smoothstep(neck + 0.15, waist, uv.y));
	float upper = 1.0 - smoothstep(0.0, waist, uv.y);
	// Breathing: chest widens and the upper body rises a little.
	v.x += (v.x - size.x * 0.5) * breath * 0.011 * torso;
	v.y -= breath * 3.2 * upper;
	// Shoulders.
	v.y -= shrug * torso * (1.0 - smoothstep(neck + 0.05, neck + 0.25, uv.y));
	// Head rotation around the neck pivot, plus nod and turn.
	vec2 pivot = vec2(size.x * 0.5, neck * size.y);
	float a = head_tilt * head;
	vec2 d = v - pivot;
	v = pivot + vec2(d.x * cos(a) - d.y * sin(a), d.x * sin(a) + d.y * cos(a));
	v.y += head_nod * head;
	v.x += head_turn * head;
	// Whole-body lean, strongest at the top, nothing at the counter line.
	v.x += lean * pow(upper, 1.4);
	VERTEX = v;
}

void fragment() {
	vec4 c = texture(TEXTURE, UV) * COLOR;
	c.rgb += vec3(1.0, 0.72, 0.42) * flash * 0.18 * c.a;
	COLOR = c;
}

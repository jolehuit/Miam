import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CzG0QyU8.js","_app/immutable/chunks/scheduler.C5rJiny9.js","_app/immutable/chunks/index.BYVj1jVj.js","_app/immutable/chunks/index.C5MXYLqn.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.OzAheV5w.js"];
export const stylesheets = ["_app/immutable/assets/0.qJTbrMMe.css","_app/immutable/assets/ProgressBar.Cirlo5Z8.css"];
export const fonts = [];

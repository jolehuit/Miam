export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.Du3sO6RL.js","app":"_app/immutable/entry/app.Dj36BdWl.js","imports":["_app/immutable/entry/start.Du3sO6RL.js","_app/immutable/chunks/entry.ob7so6Wl.js","_app/immutable/chunks/scheduler.C5rJiny9.js","_app/immutable/chunks/index.C5MXYLqn.js","_app/immutable/entry/app.Dj36BdWl.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/scheduler.C5rJiny9.js","_app/immutable/chunks/index.BYVj1jVj.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js'))
		],
		routes: [
			{
				id: "/api/findrestaurant",
				pattern: /^\/api\/findrestaurant\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/findrestaurant/_server.ts.js'))
			},
			{
				id: "/api/findspecificrestaurant",
				pattern: /^\/api\/findspecificrestaurant\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/findspecificrestaurant/_server.ts.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

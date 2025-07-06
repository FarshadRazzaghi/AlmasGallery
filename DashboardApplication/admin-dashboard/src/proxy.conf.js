const { env } = require("process");

const target = env.ASPNETCORE_HTTPS_PORT
	? `https://127.0.0.100:${env.ASPNETCORE_HTTPS_PORT}`
	: env.ASPNETCORE_URLS
	? env.ASPNETCORE_URLS.split(";")[0]
	: "https://127.0.0.100:5050";

const PROXY_CONFIG = [
	{
		context: ["/api"],
		target,
		secure: false,
		pathRewrite: { "^/api": "/api" },
		changeOrigin: false,
	},
];

module.exports = PROXY_CONFIG;

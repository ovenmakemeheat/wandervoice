import "@wandervoice/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	// Allow ngrok and any tunnel domain to access the Next.js dev server
	// without triggering the cross-origin protection added in Next.js 15
	allowedDevOrigins: [
		"*.ngrok-free.app",
		"*.ngrok.io",
		"*.ngrok.app",
	],
};

export default nextConfig;


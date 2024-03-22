import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  output: {
    format: 'iife',
  },
	plugins: [
		nodeResolve(),
		...(process.env.ELEVENTY_ENV === "production" ? [terser()] : []),
	],
};

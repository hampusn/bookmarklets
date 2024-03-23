import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: './src/_assets/js/main.js',
  output: {
    dir: './dist/assets/js',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src/_assets/js',
  },
	plugins: [
		nodeResolve(),
		...(process.env.NODE_ENV === "production" ? [terser()] : []),
	],
};

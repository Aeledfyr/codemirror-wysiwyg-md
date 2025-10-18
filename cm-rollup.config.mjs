import {nodeResolve} from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { createRollupLicensePlugin } from 'rollup-license-plugin';

export default {
  input: "./src/editor.ts",
  output: {
    file: "./editor.bundle.js",
    format: "es"
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve(),
    terser(),
    createRollupLicensePlugin(),
  ],
}


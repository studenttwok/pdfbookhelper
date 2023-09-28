// rollup.config.js
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [terser()],
  },
  {
    input: 'src/cli.js',
    output: {
      file: 'dist/cli.js',
      banner: '#!/usr/bin/env node',
    },
  }
];
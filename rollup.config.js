import babel from '@rollup/plugin-babel';
import {terser} from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js', // the output file
    format: 'esm' // or umd, cjs according to your needs
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ["@babel/preset-env"]
    }),
    typescript(),
    terser() // minify the output
  ]
};

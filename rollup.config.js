// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import nodeGlobal from 'rollup-plugin-node-globals';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.ts',
    output: [{
        file: 'build/mobius-sim-funcs.module.es.js',
        format: 'es'
      },
      {
        file: 'build/mobius-sim-funcs.module.js',
        format: 'iife',
        name: 'mobius_sim_funcs'
      }
    ],
    plugins: [
      typescript(),
      nodeResolve(),
      commonjs(),
      nodeGlobal()
    ]
  };
  
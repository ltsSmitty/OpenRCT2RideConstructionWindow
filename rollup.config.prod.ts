import path from 'path';
import type { RollupOptions } from 'rollup';
import resolve from "@rollup/plugin-node-resolve";
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import config from './config';
import { paths } from './utils';

export default <RollupOptions>{
    input: path.join(paths.src, 'index.ts'),
    output: [
        {
            file: path.join(paths.dist, `${config.getString('MOD_NAME')}.js`),
            format: 'iife',
        },
        {
            file: path.join(paths.pluginFolder, `${config.getString('MOD_NAME')}_${config.getString('NODE_ENV')}.js`),
            format: 'iife',
        },
    ],
    plugins: [
        json({ compact: true }),
        injectProcessEnv(config.getEnvConfigObject()),
        typescript(),
        resolve({ extensions: [".js", ".ts"] }),
        terser({
            compress: false,
            mangle: {
                properties: {
                    regex: /^_/,
                },
            },
            // keep_classnames: true,
            keep_fnames: true,
            format: {
                beautify: true,
                quote_style: 1,
                wrap_iife: false,
                preamble: '// Mod powered by https://github.com/wisnia74/openrct2-typescript-mod-template - MIT license',
            },
        }),
    ],
};

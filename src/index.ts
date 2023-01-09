// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../lib/openrct2.d.ts" />

import config from './config';
import main from './main';

registerPlugin({
    name: config.getString('MOD_NAME'),
    version: '1.0',
    authors: [config.getString('MOD_AUTHOR')],
    type: 'local',
    licence: 'MIT',
    targetApiVersion: 35,
    main,
});

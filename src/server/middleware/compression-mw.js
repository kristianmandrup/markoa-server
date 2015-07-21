'use strict';

import BaseMw from './base-mw';
import compress from 'koa-compress';
import zlib from 'zlib';

export default class CompressionMw extends BaseMw {
  constructor(config) {
    super(config);
  }

  get compression() {
    return {flush: zlib.Z_SYNC_FLUSH};
  }

  mount() {
    this.use(compress(this.compression));
    return this;
  }
}

'use strict';

import BaseMw from './base-mw';
import router from 'koa-router';

export default class RouterMw extends BaseMw {
  constructor(config) {
    super(config);
  }

  mount() {
    this.use(router(this.app));
    return this;
  }
}

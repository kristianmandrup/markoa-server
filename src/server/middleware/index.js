'use strict';

import Configurator from '../configurator';

export default class Middleware extends Configurator {
  constructor(config) {
    super(config);
  }

  get middlewares() {
    return this.config.middlewares;
  }

  get mounted() {
    return this.config.mounted.middleware;
  }

  set mounted(mws) {
    this.config.mounted.middleware = mws;
  }

  mountAll() {
    var mws = {};
    // use Object.keys ?
    for (let name in this.config.middlewares) {
      // can we use node require here!?
      var middleware = mws[name] = require(`./${name}-mw`);
      middleware.mount(this.config);
    }
    this.mounted = mws;

    return this;
  }
}

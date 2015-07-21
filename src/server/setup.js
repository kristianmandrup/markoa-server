'use strict';

import Configurator from './configurator';
import koa from 'koa';

// Usage new Setup(server, {})
export default class Setup extends Configurator {
  constructor(config) {
    super(config);
  }

  // app configuration
  configureApp() {
    this.app = koa();
    // mount all middleware
    this.config.middleware.mountAll(this.config);
    return this;
  }
}

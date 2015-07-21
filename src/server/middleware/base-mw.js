'use strict';

import Configurator from '../configurator';

export default class BaseMw extends Configurator {
  get use() {
    return this.app.use;
  }

  // custom mounting in callback function
  mount(cb) {
    cb(this);
    return this;
  }

  unmount(...names) {
    for (let name in names) {
      delete this.config[name];
    }
    return this;
  }
}

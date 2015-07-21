'use strict';

import Configurator from '../configurator';
import path from 'path';

export default class Settings extends Configurator {
  constructor(config = {}, options = {}) {
    super(config);
    this.options = options;
  }

  get rootPath() {
    return this.options.rootPath || this.myRoot;
  }

  get myRoot() {
    return path.resolve(path.join(__dirname, '../../../'));
  }
}

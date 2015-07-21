import Settings from './settings';
import utils from '../utils';

export default class Configuration {
  constructor(config = {}, options = {}) {
    this.settings = new Settings(config, options);
    this.utils = utils;
    this.current = {
      rootPath: this.rootPath
    };
  }

  get rootPath() {
    return this.settings.rootPath;
  }

  default(name) {
    return this.settings.default[name];
  }

  middleware(name) {
    return this.settings.middleware[name];
  }
}

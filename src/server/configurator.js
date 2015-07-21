import util from 'util';

export default class Configurator {
  constructor(config = {}) {
    this.config = config || {};
    this.validate();
  }

  validate() {
    if (typeof this.config !== 'object') {
      throw `config must be an object, was: ${util.inspect(this.config)}`;
    }
  }

  configure() {}

  get app() {
    return this.config.app;
  }

  get logger() {
    return this.config.logger;
  }

  log(msg) {
    this.logger.log(msg);
  }
}

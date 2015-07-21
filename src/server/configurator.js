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

  get logger() {
    return this.config.logger;
  }

  get log() {
    return this.logger.log;
  }
}

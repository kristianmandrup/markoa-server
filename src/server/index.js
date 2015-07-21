'use strict';

import Setup from './setup';
import Mounter from '../app/mounter';
import Configurator from './configurator';
import Configuration from './configuration';
import Runner from './runner';
import Marko from './marko';
import Middleware from './middleware';
import Render from './render';
import Routes from './routes';

// all public methods return this to allow chaining!
export default class Server extends Configurator {
  constructor(config = {}, options = {}) {
    this.options = options;
    this.config = new Configuration(config, options);
    // TODO: allow injection!
    this.mounter = new Mounter(config);
    this.init(config);
  }

  // TODO: allow injection!
  init(config) {
    this.render = new Render(config);
    this.middleware = new Middleware(config);
    this.marko = new Marko(config);
    this.runner = new Runner(config);
    this.routes = new Routes(config);
  }

  app(name) {
    return this.config.mounted[name];
  }

  get rootPath() {
    return this.config.settings.rootPath;
  }

  get settings() {
    return this.config.settings;
  }

  set settings(settings) {
    this.config.settings = settings;
  }

  // after this.config is configured
  // we to use it to setup Server
  setup() {
    this.setup = new Setup(this.config).configureApp();
    return this;
  }

  // allows full customization of server config
  customize(cb) {
    cb(this.config, this);
    return this;
  }

  configure(config) {
    this.config = Object.assign(this.config, config);
    return this;
  }

  mountApp(config, name) {
    this.mounter.mount(config, name);
    return this;
  }

  unmountApp(config, name) {
    this.mounter.unmount(name);
    return this;
  }
}

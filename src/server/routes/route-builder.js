// TODO
// Improve using either:
// https://github.com/ivpusic/koa-routing
// https://github.com/alexmingoia/koa-router

import Configurator from '../configurator';

export default class RouteBuilder extends Configurator {
  constructor(config) {
    super(config);
  }

  // get the app data for current page
  get appData() {
    return this.state.appData.current;
  }

  get state() {
    return this.config.state;
  }

  get app() {
    return this.config.app;
  }

  get render() {
    return this.config.render;
  }

  get renderPageFn() {
    // see RenderConfig.builder()
    // this will magically be the response! (controlled by app.get)
    // response, pageName, pageData
    var ctx = this;
    return function*() {
      ctx.switchContext();
      yield this.render(this, ctx.pageName, ctx.appData);
    };
  }

  // set key globals relative to mounted page
  switchContext() {
    this.config.current.page = this.pageName;
    this.config.current.rootPath = this.currentRootPath();
  }

  get currentRootPath() {
    return this.config.mounted[this.pageName].rootPath || this.config.rootPath;
  }

  get routeName() {
    return this.route || this.pageName;
  }

  get routePath() {
    return `/${this.routeName}`;
  }

  // TODO: use koa-router instead!
  buildRoute(pageName, route) {
    this.pageName = pageName;
    this.route = route;
    this.app.get(this.routePath, this.renderPageFn);
  }
}

'use strict';

import Configurator from '../configurator';

export default class RouteConfig extends Configurator {
  constructor(config) {
    super(config);
  }

  get routeBuilder() {
    return new this.config.routes.routeBuilder(this.config);
  }

  get pages() {
    return this.config.views.pages;
  }

  // returns factory function which can
  // create marko routes using data dictionary for async fragments
  // build all routes
  buildAll() {
    // create an index route
    this.routeBuilder.buildRoute('index', '/');

    // create routes for each page
    for (let page of this.pages.active) {
      this.routeBuilder.buildRoute(page);
    }
  }
}

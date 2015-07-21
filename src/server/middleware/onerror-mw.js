'use strict';

import BaseMw from './base-mw';
import onerror from 'koa-onerror';
import errorHandlers from './onerror/error-handlers';

var errorTemplates = {
  active: null,
  default: 'views/pages/error/error.marko'
};

export class OnErrorMw extends BaseMw {
  constructor(config) {
    super(config);
  }

  mount(config) {
    var errorPage = this.config.views.pages.error;
    errorTemplates.active = errorPage || errorTemplates.default;

    // We need to make error handlers available on server object for overrides
    // by apps
    config.handlers.error = errorHandlers;
    config.views.pages.error.templates = errorTemplates;

    onerror(this.app, errorHandlers);
    return this;
  }
}

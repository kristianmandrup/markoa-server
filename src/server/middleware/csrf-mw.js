'use strict';

import BaseMw from './base-mw';
import csrf from 'koa-csrf';
import session from 'koa-session';

import {csrfInjector, csrfAsserter} from './csrf/';

// https://github.com/koajs/csrf
export default class CsrfMw extends BaseMw {
  constructor(config) {
    super(config);
  }

  get secrets() {
    return this.config.secrets;
  }

  mount() {
    this.validate();
    this.app.keys = [this.secrets.csrf];
    this.use(session());
    csrf(this.app);
    this.use(csrf.middleware)
      .use(csrfInjector)
      .use(csrfAsserter);
    return this;
  }

  validate() {
    if (!this.config.secrets) {
      throw 'Missing secrets on server config';
    }
    if (!this.config.secrets.csrf) {
      throw 'Missing csrf secrets on server config';
    }
  }
}

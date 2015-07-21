'use strict';

import BaseMw from './base-mw';
import jwt from './jwt';

export default class JwtMw extends BaseMw {
  constructor(config) {
    super(config);
  }

  // http://www.sitepoint.com/using-json-web-tokens-node-js/
  mount() {
    this.use(jwt.decodeToken)
      .use(jwt.authErrorHandler.unauthorizedAccess);
    return this;
  }
}

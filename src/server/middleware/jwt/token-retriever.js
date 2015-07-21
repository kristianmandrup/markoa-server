'use strict';

export default class TokenRetriever {
  constructor(request) {
    this.request = request;
  }

  get tokenName() {
    return 'access-token';
  }

  get body() {
    return this.request.body;
  }

  get query() {
    return this.request.query;
  }

  get retrieveToken() {
    return this.headerToken || this.bodyToken || this.queryToken;
  }

  get bodyToken() {
    return this.body && this.body[this.tokenName];
  }

  get queryToken() {
    return this.query && this.query[this.tokenName];
  }

  get headerToken() {
    return this.request.headers[`x-${this.tokenName}`];
  }
}

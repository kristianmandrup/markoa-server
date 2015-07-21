'use strict';

import Configurator from '../../configurator';
import TokenRetriever from './token-retreiver';
import jwt from 'jwt-simple';

export default class TokenParser extends Configurator {
  get tokenRetriever() {
    return new TokenRetriever(this.request);
  }

  get token() {
    this.tokenRetriever.retrieveToken();
  }

  get validateTokenEndPoint() {
    return `/auth_tokens/${this.token}/validate`;
  }

  validateToken() {
    // using https://github.com/smigit/iaa_service
    // TODO: use Betty instead
    return this.app.get(this.validateTokenEndPoint);
  }

  get validatedToken() {
    return this.validateToken();
  }

  get decodedToken() {
    return jwt.decode(this.token, this.validatedToken);
  }

  decodeToken(request, next) {
    this.request = request;
    if (this.token) {
      try {
        this.log('decoded token', this.decodedToken);
        // handle token here
        return this.decodedToken;
      } catch (err) {
        this.log('Decode Token Error', err);
      }
    }
    return next();
  }
}

'use strict';

// Custom 401 handling if you don't want to expose koa-jwt errors to users
export default function*(next) {
  try {
    yield next;
  } catch (err) {
    if (err.status === 401) {
      this.status = 401;
      this.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  }
}

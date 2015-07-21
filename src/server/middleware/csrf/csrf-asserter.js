// TODO: parsing!!
// See https://github.com/koajs/csrf
function parse(x) {
  return x;
}

export default function*() {
  var body = yield parse(this); // co-body or something
  try {
    // huh!?
    this.assertCSRF(body);
  } catch (err) {
    this.status = 403;
    this.body = {
      message: 'The CSRF token is invalid!'
    };
  }
}

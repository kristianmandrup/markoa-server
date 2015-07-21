// TODO: improve!
// use generator function?
// https://github.com/koajs/csrf
export default function() {
  if (this.method === 'GET') {
    this.body = this.csrf;
  } else if (this.method === 'POST') {
    this.status = 204;
  }
}

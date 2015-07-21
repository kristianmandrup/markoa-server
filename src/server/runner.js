import Configurator from './configurator';

export default class Runner extends Configurator {
  start(options = {}) {
    var port = options.port || this.config.port;
    this.log('start server:', port);

    this.app.listen(port, function() {
      this.log(`Koa appplication listens on port ${port}`);
      if (process.send) {
        process.send('online');
      }
    });
  }

  stop() {
    this.log('stopping server: NOT IMPLEMENTED');
    // TODO: there is a better way to gracefully shut down!
    // https://github.com/koajs/koa/issues/328
  }

  kill() {
    this.log('kill server!!');
    throw 'Killed server';
  }
}

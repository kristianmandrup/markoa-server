'use strict';

/* global Server */
import Server from '../../src/index';

describe('Server', () => {
  it('exists', () => {
    expect(Server).to.not.be.undefined;
  });

  describe('with no config', () => {
    var server = new Server();

    it('has configuration', () => {
      expect(server.config).to.not.eql({});
    });

    it('has empty mounted object', () => {
      expect(server.config.mounted).to.eql({});
    });

    it('has mount function', () => {
      expect(server.mount).to.not.be.undefined;
    });

    describe('#mount', () => {
      it('mounts a single config on mounted', () => {
        var casinoConf = {a: 2};
        server.mount(casinoConf, 'casino');
        expect(server.config.mounted.casino).to.eql(casinoConf);
      });
    });

    describe.skip('#setup', () => {
      it('configures defaults', () => {
        server.setup();
        expect(server.config.defaults).to.not.eql({});
      });
    });
  });
});

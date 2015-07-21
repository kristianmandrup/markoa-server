'use strict';

import Runner from '../../../src/server/runner';

// used to start/stop and kill the server
describe('Runner', function() {
  it('exists', () => {
    expect(Runner).to.not.be.undefined;
  });

  it('is a class (constructor)', () => {
    expect(Runner).to.be.a('function');
  });

  describe('empty config', function() {
    var runner = new Runner({});

    it('has config', () => {
      expect(runner.config).to.eql({});
    });
  });

  describe('#start', function() {
  });

  describe('#stop', function() {
  });
});

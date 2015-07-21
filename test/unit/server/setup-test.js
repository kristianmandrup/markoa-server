'use strict';

import Setup from '../../../src/server/setup';

describe('Setup', function() {
  it('exists', () => {
    expect(Setup).to.not.be.undefined;
  });

  it('is a class (constructor)', () => {
    expect(Setup).to.be.a('function');
  });

  describe('empty config', function() {
    var setup = new Setup({});

    it('has config', () => {
      // throw util.inspect(routes.config);
      expect(setup.config).to.be.a('object');
      expect(setup.config).to.eql({});
    });
  });
});

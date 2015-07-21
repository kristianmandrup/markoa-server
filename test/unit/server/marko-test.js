'use strict';

import MarkoConfig from '../../../src/server/marko';

describe('MarkoConfig', function() {
  it('exists', () => {
    expect(MarkoConfig).to.not.be.undefined;
  });

  describe('empty config', function() {
    var marko = new MarkoConfig({});

    it('has config', () => {
      expect(marko.config).to.eql({});
    });
  });
});

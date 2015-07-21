import mwconf from '../../../../src/server/settings/middleware-conf';

describe('middleware-conf', function() {
  it('exists', () => {
    expect(mwconf).to.not.be.undefined;
  });
});

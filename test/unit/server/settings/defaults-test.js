import defaults from '../../../../src/server/settings/defaults';

describe('defaults', () => {
  it('exists', () => {
    expect(defaults).to.not.be.undefined;
  });

  describe('port', () => {
    it('is 4000', () => {
      expect(defaults.port).to.eql(4000);
    });
  });
});

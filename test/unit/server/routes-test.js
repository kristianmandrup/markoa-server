import Routes from '../../../src/server/routes';

describe('Routes', function() {
  it('exists', () => {
    expect(Routes).to.not.be.undefined;
  });

  it('is a class (constructor)', () => {
    expect(Routes).to.be.a('function');
  });

  describe('empty config', function() {
    var routes = new Routes({});

    it('has config', () => {
      // throw util.inspect(routes.config);
      expect(routes.config).to.be.a('object');
      expect(routes.config).to.eql({});
    });
  });
});

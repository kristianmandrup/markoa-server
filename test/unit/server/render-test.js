'use strict';

import Render from '../../../src/server/render';

describe('Render', function() {
  it('exists', () => {
    expect(Render).to.not.be.undefined;
  });

  it('is a class (constructor)', () => {
    expect(Render).to.be.a('function');
  });

  describe('empty config', function() {
    var render = new Render({});

    it('has config', () => {
      expect(render.config).to.be.a('object');
      expect(render.config.render).to.be.a('function');
      expect(render.config.rendering).to.be.a('object');
    });
  });
});

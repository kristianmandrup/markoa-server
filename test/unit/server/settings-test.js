import Settings from '../../../src/server/settings';
import path from 'path';

describe('Settings', () => {
  it('exists', () => {
    expect(Settings).to.not.be.undefined;
  });

  describe('empty config', () => {
    let settings = new Settings({});

    it('has config', () => {
      expect(settings.config).to.eql({});
    });

    it('#rootPath', () => {
      let myRoot = path.resolve(path.join(__dirname, '../../../'));
      expect(settings.rootPath).to.eql(myRoot);
    });
  });

  describe('#config', () => {
    let myRoot = 'path/to/root';
    let config = {};
    let options = {rootPath: myRoot};
    let settings = new Settings(config, options);

    describe('#rootPath', () => {
      expect(settings.rootPath).to.eql(myRoot);
    });

    describe('#myRoot', () => {
      it('not same as rootPath', () => {
        expect(settings.myRoot).to.not.eql(myRoot);
      });

      it('not same as rootPath', () => {
        expect(settings.myRoot).to.not.eql('');
      });
    });
  });
});

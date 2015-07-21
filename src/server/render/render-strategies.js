import Configurator from '../configurator';
import marko from 'marko';

var renderStrategies = {
  streamed: function(template, data) {
    marko.load(template).stream(data);
  }
};

export default class RenderStrategies extends Configurator {
  // TODO: improve this
  constructor(config) {
    super(config);
  }

  configure() {
    this.strategies = renderStrategies;
    this.strategies.default = this.strategies.streamed;
  }

  get strategies() {
    return this.config.rendering.strategies;
  }

  set strategies(strategies) {
    this.config.rendering.strategies = strategies;
  }
}

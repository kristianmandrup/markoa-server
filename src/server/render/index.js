'use strict';

import Configurator from '../configurator';
import RenderStrategies from './render-strategies';
import RenderConfig from './render-config';

export default class Render extends Configurator {
  constructor(config) {
    super(config);
    this.renderStrategies = new RenderStrategies(config);
    this.renderConfig = new RenderConfig(config);
  }
}

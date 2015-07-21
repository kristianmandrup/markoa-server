import Configurator from '../configurator';
import RouteBuilder from './route-builder';
import RouteConfig from './route-config';

export default class Routes extends Configurator {
  constructor(config) {
    super(config);
    this.routeBuilder = new RouteBuilder(config);
    this.routeConfig = new RouteConfig(config);
  }
}

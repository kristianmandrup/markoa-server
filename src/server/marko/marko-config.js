'use strict';

import path from 'path';
import Configurator from '../configurator';
import reloader from 'marko/hot-reload';
import refresher from 'marko/browser-refresh';

export default class MarkoConfig extends Configurator {
  get viewsPath() {
    return this.config.views.rootPath;
  }

  isMarkoTemplate(filename) {
    return /\.marko$/.test(filename);
  }

  enableReload() {
    refresher.enable();
    reloader.enable();
  }

  reloadModifiedTemplate(filename) {
    // Resolve the filename to a full template path:
    var templatePath = path.join(this.viewsPath, filename);
    // console.log('Marko template modified: ', templatePath);
    // Pass along the *full* template path to marko
    reloader.handleFileModified(templatePath);
  }

  watchTemplates() {
    this.enableReload();
    require('fs').watch(this.viewsPath, function(event, filename) {
      if (this.isMarkoTemplate(filename)) {
        this.reloadModifiedTemplate(filename);
      }
    });
  }

  // TODO: cleanup and refactor!
  configure() {
    if (process.env.NODE_ENV !== 'production') {
      this.watchTemplates();
    }
  }
}

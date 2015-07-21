# Server overview

The `src/server` folder contains the file structure for the Koa server.

The Koa-Marko setup is losely based on the screencast [serving-content-in-koajs-with-marko](http://knowthen.com/episode-8-serving-content-in-koajs-with-marko/)

You can include the full server simply by:

`var server = require('./src/server');`

### Initializer

Initialization is done as the last part of the Server constructor in order to build the entire Server object graph.

Any app can then mount Application or customize parts of the Server graph as needed, before calling `setup()` on server to use that configuration to setup the Koa server.

### Setup

`setup.js` is used to setup the Koa server with middleware configurations etc.

### Defaults

`/defaults` contains default configurations for application State and Views. Mounted apps or pages can use or override these defaults.

### Rendering

`/render` contains the basic rendering logic.

`render-strategies` contain some basic Rendering strategies such as streamed rendering (used by default).

The `render` function will find the Marko template for the page and pass the page data to the template.

```js
function(response, pageName, pageData) {
  var pageTemplate = this.findPageTemplate(pageName);
  this.log('rendering template, data:', pageTemplate, pageData);
  response.body = this.render(pageTemplate, pageData);
  response.type = 'text/html';
};
```

### Routes

`/routes` contains route builder functions.

When a route is entered, it will first switch context, by setting `this.config.current` object with the current `page` and `rootPath` to be used for that page.

```js
get renderPageFn() {
  var ctx = this;
  return function*() {
    ctx.switchContext();
    yield this.render(this, ctx.pageName, ctx.appData);
  };
}

// set key globals relative to mounted page
switchContext() {
  this.config.current.page = this.pageName;
  this.config.current.rootPath = this.currentRootPath();
}
```

In the future it should use `koa-routes` or similar for a better routing solution (see `routes`).

## State

See `State.md` in `server/defaults/state`

## Utils

The `/utils` folder contains general purpose utility functions, such as loading various types of files, making Ajax requests etc.

## Marko

The `/marko` folder contains the Marko templating configuration for the server.

## Lasso

We need some lasso configuration for bundling assets runtime!!!

TODO

## Middleware

The `/middleware` folder contains middleware configurations.

## Assets bundling (lasso)

TODO

Marko asset dependencies can be local or [external](https://github.com/lasso-js/lasso/issues/61)












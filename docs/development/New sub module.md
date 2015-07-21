## New sub-module

*WIP*

The `markoa` server should serve as a baseline for a new app.

When creating a new sub-module:

1) Setup project

* Create a new project using the [es6 starter kit](https://www.npmjs.com/package/es6-project-starter-kit) or similar skeleton
* install `markoa` as a module: `npm install markoa --save`
* install all packages `npm install`

The project is a sub-module to be mounted on an existing application

`npm install my-app --save`

Optionally install other sub-modules

`npm install other-sub-module --save`

```js
var App = require('my-app');
var moduleX = require('other-sub-module')
var moduleY = require('./my-sub-module')

var baseApp = new App().mount(moduleX);
baseApp.mount(moduleY);
```

### Sub-module parts

- state (models/data)
- views (templates, layouts)
- assets

Note: You can even create sub-modules that deliver just state, views or assets and mount them on the app!

## Configuration

Configure the sub module via a Configuration object:

```js
//config.js
export default {
  port: 4000
  views: {
    root:  'views',
    pages: 'pages'
  },
  static: {
    root: 'public',
  },
  pages: {
    active: ['index', 'casino']
  },
  ...
}
```

Then run your app!

`node app.js`

Typically a Sub-module should be for a single page of the app, such
as a Casino module for the Casino page, data providers, state and assets.

The server object should have one key per page:

```
server: {
  app: {koa object},
  pages: {
    available: ['default', 'index']
    active: ['casino'] // ie. routable
  },
  page: {
    default: {},
    index: {},
    casino {},
    ...  
  }  
}
```

This way, each page can have its own server configuration, such as where it loads its scss files, a custom render method etc.
If not defined, each page will fallback to use the `default`.


### Mounting  Application Views

You project should folder the views conventions:

```sh
/views
  /layouts (shared)
  /partials (shared)
  /pages
    /casino
      casino.marko
      browser.json (config: dependencies)
      ...
      /partials
        _header.marko
      /layouts
        casino-layout.marko
        /mobile
        /desktop

lasso-config.js : global config/dependencies
```

*To be Improved and Generalized*

Mount a page folder like this in `app-config.js`

```js
export default {
  return {
    views: require('./views')
    state: require('./state')
  }
};
```

## Mounting Application State

And yes, you can mount custom state at any granularity as well ;)
Again, the server will automatically merge your state object on top of the default one.

```js
// state.js
module.exports = {
  session: session.testUser,
  pages: {
    casino: utils.load('casino-data')
  }
  providers: {
    casino: store.casinoData
  }
}
```

## Mounting explained

When you execute `server.configure(appConfig)` the server will merge your `appConfig` object on top of the default server configuration via [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

This approach allows you to create modules for specific pages.
You can even combine multiple of such separate page modules into a single app configuration by suppplying an array of config objects to configure. They will then be merged in order! Amazing!

`
server = new Server(options).configure([conf.casino, conf.account]).run();`

Each configuration can mount a server configuration for a modules, such as individual assets, stylesheets (sccs?) and views.
Each module can contain its own state used for testing during development, then being discarded or merged with the full app as you like ;)

```js
var app = new Server(options).configure(conf.casino).configure(conf.account).run();`
Server(options).configure(conf, ['casino', 'account']).run();`
```
## New Application or sub-module

*WIP*

The `markoa` server should serve as a baseline for a new app.

When creating a new app or application module, 
the developer should:

1) Setup project

* Create a new project using the [es6 starter kit](https://www.npmjs.com/package/es6-project-starter-kit) or similar skeleton
* install `markoa` as a module: `npm install markoa --save`
* install all packages `npm install`

The project is a sub-module to be mounted on an existing application

`npm install my-app --save`

Optionally install other sub-modules

`npm install sub-module --save`

```js
var App = require('my-app');
var moduleX = require('sub-module')
var moduleY = require('./my-sub-module')

var baseApp = new App().mount(moduleX);
baseApp.mount(moduleY);
```

- application state
- views

Configure server via server `config` object (paths, ports etc)

```js
//config.json
{
  "server": {
    "port": 4000
    "views": {
      "root": "./views",
      "pages": "pages"
    },
    "static": {
      "root": "./public",
    },
    "pages": ["index", "casino"]
    ...
  },

  ...  
}
```

Sample `package.json` for your Application>

```json
// package.json
{
  "name": "forvetbet",
  "version": "0.1.0",
  "description": "Forvetbet Application",
  "main": "app.js",
  "scripts": {
    "test": "mocha"
  },
  "keywords": [
    "Forvetbet",
    "koajs",
    "nodejs",
    "marko"
  ],
  "authors": [
    "Me <me@gmail.com>",
  ],
  "dependencies": {
    "rapid-render": "^0.1.0",
    ...
  },
  "devDependencies": {
    "co-body": "^1.0.0",
    "co-mocha": "^1.1.0",
    "co-supertest": "0.0.7",
    "colors": "^1.0.3",
    "html": "0.0.7",
    "karma-lasso": "^1.0.0",
    "koa": "^0.14.0",
    "lasso-require": "^1.3.6",
    "marko": "^1.3.24",
    "marko-layout": "^1.2.6",
    "mocha": "^2.1.0",
    "supertest": "^0.15.0"  
    ...
  }  
}
```

Create a file `app.js` in the root of your project.

```js
// app.js

var server = require('rapid-render');

// node require can load from JSON and convert to Object
var appConfig = require('./lib/app-config');
var options = {config: appConfig};

server.configure(options).run();
```

Then run your app!

`node app.js`

### Add Application Views

Add a folder `/views/pages` to your project
Add a folder for each page.

```sh
/views
  /pages
    /casino
      casino.marko
      browser.json
      ...
```

Mount a page folder like this in `app-config.js`

```js
// TODO: should be made available from server
var createPathUtils = function(options) {
  return {
    viewPagePath: function(name) {
      pagesRoot = options.pagesRoot || 'views/pages'; 
      var pagePath = path.join(options.root, pagesRoot, name);
      return path.resolve(pagePath);
    }
  }
}

var mount = {
  page: pathUtils.viewPagePath
};

module.exports = function(options) {
  var pathUtils = createPathUtils(options);

  var state   = require('./state');
  var views = {
    pages: {
      casino: mount.page('casino')
    }
  }

  return {
    views: views
    state: state
  }
};
```

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

When you execute `server.configure(appConfig)` the server will merge your `appConfig` object on top of the default server configuration.

This approach allows you to create modules for specific pages.
You can even combine multiple of such separate page modules into a single app configuration by suppplying an array of config objects to configure. They will then be merged in order! Amazing!

`
server = new Server(options).configure([conf.casino, conf.account]).run();`

Each configuration can mount a server configuration for a modules, such as individual scss and view source directories etc.

`new Server(options).configure(conf.casino).configure(conf.account).run();`

`Server(options).configure(conf, ['casino', 'account']).run();`
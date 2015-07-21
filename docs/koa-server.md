## Koa server

The Koa server is a thin core with a plugin system for inserting various middlewares.
The middlewares act as a set of transformations on the Request/Response cycle.

[Koa middlewares](https://github.com/cnpm/koa-middlewares)

For the Rapid Render server, we are currently looking at the following middlewares...

- [koa-logger](https://github.com/koajs/logger) : Logging
- [koa-static-cache](https://github.com/koajs/koa-static-cache) : Static file cache
- [koa-safe-jsonp](https://github.com/koajs/koa-safe-jsonp) : JSONP
- [koa-router](https://github.com/alexmingoia/koa-router) : Routing
- [koa-jwt](https://github.com/koajs/jwt) : Json Web Tokens (JWT)
- [koa-csrf](https://github.com/koajs/csrf) : Cross-Site Request Forgery (CSRF)
- [koa-onerror](https://github.com/koajs/onerror) : Error handling

## Middlewares

To use middlewares you can simpoly include the `koa-middlewares` module like this:

`var middlewares = require('koa-middlewares');`

### Logger

```js
middlewares.logger(app);
```

### JSONP

JSONP or “JSON with padding” is a communication technique used in JavaScript programs running in web browsers to request data from a server in a different domain, something prohibited by typical web browsers because of the same-origin policy.

### OnError

Sample use:

```js
var onerror = require('koa-onerror');
var app = koa();

onerror(app, {
  template: function(e) {
    ...
  }
});
```

`onerror` API:

```js
onerror(app, options);

all: if options.all exist, ignore negotiation
text: text error handler
json: json error handler
html: html error handler
template: default html error handler template path
redirect: if accepct html, can redirect to another error page
```

### Static cache

```js
var path = require('path')
var staticCache = require('koa-static-cache')

app.use(staticCache(path.join(__dirname, 'public'), {
  maxAge: 365 * 24 * 60 * 60
}))
```

### CSRF

```js
middlewares.csrf(app);
app.use(function *checkCsrf(next) {
  if (this.method === 'GET' ||
      this.method === 'HEAD' ||
      this.method === 'OPTIONS') {
    return yield *next;
  }

  this.assertCsrf();
  yield next;
});
```

### Routes

```js
var router = require('koa-router')();
router.get('/', function *(next) {...});

app
  .use(router.routes())
  .use(router.allowedMethods());
```

## Rapid Render

Rapid Render leverages the Koa server and uses the Marko templating language for an extremely fast and efficient "first render" strategy in a multi page app. Rapid Render enforces some specific conventions to make it easy for the Frontend developers to work on wireframing/layout without having to worry about the internals. The model/data or backend can be completely stubbed using static data, randomized data or fake server. The server can even be simulated "in browser" using [Pretender](https://github.com/trek/pretender) to intercept Ajax request and mock responses.

### Pretender

Pretender will temporarily replace the native XMLHttpRequest object, intercept all requests, and direct them to a little pretend service you've defined.

### File structure overview

`test/fixtures` : sample data to simulate REST API calls
`/config` : pages configuration
`/lib` : small libraries of functions

## Route/Rendering infrastructure

Currently consist of the following files

`route.js` : routing strategy and factory methods
`render.js` : page rendering strategies

### Rendering

Rendering for any page uses a generic rendering mechanism:
The page must be found in `views/[page name].marko`

```js
function findTemplate(template, data) {
  return `./views/${template}.marko`
}

module.exports =  function(response, template, data) {
  console.log('rendering using:', data);
  response.body = marko.load(findTemplate(template)).stream(data);
  response.type = 'text/html';
}
```

## Routing

Currently exposes a single factory method. This could be expanded to include alternative factory methods if needed
for specific cases...

```
module.exports =  function(app, render, data) {
  return function (name, route) {
    app.get(`/${route || name}`, function *(){
      render(this, name, data[name]);
    });
  };
}
```

## Configuration

Is done in the `/config` folder, usually via json or YAML files loaded via `loader.js`.

### Pages enabled

`pages.json`

```js
[
  "prematch",
  "live",
  "casino"
]
```

or as YAML

```yaml
- prematch
- live
- casino
```

### Detailed page config

Can be done via `page-features.json`, where page that require special config can have a config object assigned:

```js
[
  "prematch": {
    "auth": {
      ...
    }
  }
]
```

equivalent YAML config

```yaml
prematch:
  auth:
    required: true
```

## Utils

`utils.js` : basic utility methods like delayed
`loader.js` : data loaders from various sources such as json files etc

## Models and data

`store.js` : map of available data store retriever functions, grouped by category
`provider.js` : map of data providers, using available stores, grouped by category
`data.js`: map of data sets grouped per page. Uses data from provider and loader.

### Store

The store contains a map of data store retriever functions.
Each store can be set up to load the data from whatever data source it chooses.
In the following example, they are simply loaded from json files wrapped by a delayed decorator function
to simulate realistic network delays for each specific data source.

```js
// Retrieves a resource
// In real app will load JSON via HTTP GET
function retriever(resource, delay){
  return function () {
    let loadData = delayed(loader.file(resource, 'json'), 1500);
    return loadData.then(function(data){
      console.log(data);
      return data;
    });
  }
}

// Data sources available
// store
module.exports = {
  menuItems: retriever('menu-items', 1500),
  sportsMenus: retriever('sports-menu', 3000),
};
```

### Providers

The providers aggregate data store retriever functions, grouped per page.
The `global` providers are available to any page.

```
module.exports =  {
  global: {
    menuItems: store.menuItems
  },
  index: {
    sportsMenu: store.sportsMenu
    popularGames: store.popularGames
  },
  prematch: {
    sportsMenu: store.sportsMenu
    popularGames: store.popularGames
    topTenGames: store.topTenGames
  }
}
```

### Session

```
module.exports =  {
  guest: {
    user: {}
  },
  basic: {
    user: {
      name: 'eclevic',
      email: 'eclevic@gmail.com',
      ...
    }
  },
  admin: {
    user: {
      name: 'eclevic',
      email: 'eclevic@gmail.com',
      ...
    }
  }
}
```


### Data

The `data` module exports a JSON object which aggregates all the different data categories per page and for `global` access.

```js
module.exports =  {
  global: {
    providers: providers.global
    content: content.global
    session: session.basic
  },
  index: {
    providers: providers.index
    content: content.index
  }
}
```

Note: This will soon be automated instead of being maintained manually, since it follows a general pattern.

Also note that Marko has a built-in concept of global data, using the special `$` global key. The global data is available from within a template as `out.global`

```js
module.exports =  {
  $global: {
  },
  page: {

  }
}
```

### Generic render

Each route has a `render` function which retrieves the data to render simply by using this data map and retrieving the data for the page name key, ie `data['index']` for the index page. The state is some kind of object or identifier uses to identify the current state of the user such as "logged in" etc. This is used to decide which session (and perhaps other data) to make available for that page.

```js
function (name, route, state) {
  app.get(`/${route || name}`, function *(){
    render(this, name, data(name, state));
  });
}
```

A data structure like the following is thus delivered to each page to use for rendering.

```js
{
  $global: {
    session: {
      username: []
    },
    content: {
    },
    providers: {
      menuItems: function() {}
    }
  },
  page: {
    content: {
      articles: []
    },
    providers: {
      sportsMenu: function() {}
    },
    ...
  }
}
```

### Page rendering

The `provider` functions are used with `async-fragment` elements to retrieve the data lazily.
The `async-fragment-placeholder` is used to indicate what to until the data is retrieved and swapped in to replace the placeholder.

```html
<body
  ...
  <async-fragment data-provider='data.providers.shoppingCart' var='shoppingCart' client-reorder='true'>
    <async-fragment-placeholder>
      <img src='img/spinner.gif' />
    </async-fragment-placeholder>
    <for each='item in shoppingCart.items'>
      <div class='row'>
        ...
    </for>
  </async-fragment>
```

## Views

Views consist of:
- Pages
- Layouts
- Partials

Special
- Custom tags
- Macros
- Helper functions
- Directives (element, attribute)

The front end developers should normally only be considered with files in the following directories.

```
/views : pages, templates and partials
  /pages : the actual pages
    - [name].marko
    /[name]
      - [name-layout].marko
      /partials
      - _[name].marko
  /common
    /layouts : shared common layouts
      ...
    /partials : shared common fragments
      ...

/public : static resources
  /fonts
  /sprites
  /imgs
```

Sample views file structure using the outlined conventions:

```
/views : pages, templates and partials
  /pages : the actual pages
    index.marko
    /index
      - index-layout.marko
      /partials
        - _splash.marko
        - _market-selection.marko
  /common
    /layouts : shared common layouts
      - default-layout.marko
      - casino-layout.marko
      - promotion-layout.marko
    /partials : shared common fragments
      - _header.marko
      - _footer.marko

/public : static resources
  /fonts
    - font-awesome.tiff
  /sprites
    - sports-menu.png
  /imgs
    /spinners
      - spinner.png
      - spinner-big.png
    /banners
      - tennis-banner-big.png
```

### Koa server

The Koa server is initialized and started in `server.js`.

Configuration of the Koa server is done in `koa-config.js`
You can configure the `port` used, plugins and the rendering strategy (compression, streaming, ...)


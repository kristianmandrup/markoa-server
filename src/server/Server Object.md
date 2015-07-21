# The Server Object

```js
server: {
  app: {...} // the Koa application object
  marko: {} // marko templating
  // used when router switches context
  // ensures we can access page specific templates
  current: {
    page: 'index',
    rootPath: 'path/to/current/page/root'
  },
  // middleware config
  middleware: {
    compression: {
      mount: fn(server, options)
    },
    csrf: {},
    jwt: {},
    onerror: {},
    router: {},
    scss: {},
    static: {},
    ...
  },
  // each page module can mount its own custom config here
  // this allows each modules to have register its own location for
  // views and state to be used
  mounted: {
    index: {
    },
    casino: {
    },
    ...
  }
  // render methods
  render: {
    streamed: fn(response, pageTemplateName, pageData)
  },
  // routing methods
  routes: {
    createBuilder: fn(), // returns route build function
    buildAll: fn() // build all routes
  },
  // start/stop Koa app
  execute: {
    start: fn(server, options),
    stop: fn(server)
  },
  pages: {
    available: ['index', 'prematch', 'live', casino'],
    active: ['index', 'casino']
  },
  // or use mounted!?
  page: {
    default: {
      render: fn()

      },
      config: {},
      state: {
        // See Server-State.md
      },
      views: {
        // See Views.md
      }
    },
    // each page can be set up with individual views and state config
    // pages can also have custom render methods
    index: {
      ...
    },
    ...
  }
}
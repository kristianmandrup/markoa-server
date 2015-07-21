## Bundling strategies

- [Lasso.js](https://github.com/lasso-js/lasso) will be used for *Page bundling*.
- [Webpack](http://webpack.github.io/) will be used for when developing: apps, widgets and libraries

## Development

For Apps, Widgets or libraries we have settled on the following:

- React.js
- [react-hot-loader](https://github.com/gaearon/react-hot-loader)

See this [demonstration video](https://www.youtube.com/watch?v=xsSnOQynTHs)

Use our blueprint project generator, configured for:
- Webpack
- Karma
- React

This skeleton was extracted from [mobile-live-adapter](https://github.com/smigit/mobile-live-adapter) and futher refined

INSERT link to "skeleton app" which should be converted to a [Yeoman generator](http://yeoman.io/authoring/)

### Webpack

Webpack is our main bundler for developing Javascript modules. Webpack includes:

- [hot-module-replacement](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack)

Which can be used in development as LiveReload replacement. 

*How to*

The `webpack-dev-server` supports a hot mode which try to update with HMR before trying to reload the whole page. Add the `webpack/hot/dev-server` entry point and call the dev-server with `--hot`

- It's LiveReload but for every module kind.
- You can use it in production.
- The updates respect your Code Splitting and only download updates for the used parts of your app.
- You can use in for a part of your application and it doesn't affect other modules
- If HMR is disabled all HMR code is removed by the compiler (wrap it in if(module.hot)

See the [HMR tutorial](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack#tutorial)

To use hot code replacement with webpack you need to four things:

- records (`--records-path`, `recordsPath: ...`)
- global enable hot code replacement (`HotModuleReplacementPlugin`)
- hot replacement code in your code `module.hot.accept`
- hot replacement management code in your code `module.hot.check`, `module.hot.apply`

## Page bundling

TODO


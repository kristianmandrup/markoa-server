## Lasso asset bundling

Node.js-style JavaScript module bundler that also provides first-level support for optimally delivering JavaScript, CSS, images and other assets to the browser.

Core features:
- bundling
- code splitting
- lazy loading
- conditional dependencies
- compression
- fingerprinted resource URLs

Plugins are provided to support pre-processors and compilers such as Less, Stylus and Marko.

### Design

- Dependencies should be declarative or discovered via static code analysis
- Common module loading patterns should be supported
- Must be extensible to support all types of resources
- Maximize productivity in development
- Maximize performance in production
- Must be easy to adopt and not change how you write your code
- Can be used at runtime or build time
- Must be easy to configure

### Installation

`npm install lasso --save`

```sh
lasso style.less \
    --main main.js \
    --inject-into my-page.html \
    --plugins lasso-less \
    --development
If everything worked correctly then you should see output similar to the following:
```


Output for page `"my-page"`:

```sh
  Resource bundle files:
    static/add.js
    static/raptor-modules-meta.js
    static/main.js
    static/node_modules/jquery/dist/jquery.js
    static/raptor-modules-1.0.1/client/lib/raptor-modules-client.js
    static/style.less.css
  HTML slots file:
    build/my-page.html.json
  Updated HTML file:
    my-page.html
```

The updated `my-page.html` file should be similar to the following:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lasso.js Demo</title>
    <!-- <lasso-head> -->
    <link rel="stylesheet" type="text/css" href="static/style.less.css">
    <!-- </lasso-head> -->
</head>
<body>
    <h1>Lasso.js Demo</h1>
    <!-- <lasso-body> -->
    <script type="text/javascript" src="static/raptor-modules-1.0.1/client/lib/raptor-modules-client.js"></script>
    <script type="text/javascript" src="static/add.js"></script>
    <script type="text/javascript" src="static/raptor-modules-meta.js"></script>
    <script type="text/javascript" src="static/node_modules/jquery/dist/jquery.js"></script>
    <script type="text/javascript" src="static/main.js"></script>
    <script type="text/javascript">$rmod.ready();</script>
    <!-- </lasso-body> -->
</body>
</html>
```

If you open up `my-page.html` in your web browser you should see a page styled with Less and the output of running `main.js`.

Now try again with production mode:

```sh
lasso style.less \
    --main main.js \
    --inject-into my-page.html \
    --plugins lasso-less \
    --production
```

Output for page "my-page":

```sh
  Resource bundle files:
    static/my-page-2e3e9936.js
    static/my-page-169ab5d9.css
  HTML slots file:
    build/my-page.html.json
  Updated HTML file:
    my-page.html
```

The updated `my-page.html` file should be similar to the following:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lasso.js Demo</title>
    <!-- <lasso-head> -->
    <link rel="stylesheet" type="text/css" href="static/my-page-169ab5d9.css">
    <!-- </lasso-head> -->
</head>
<body>
    <h1>Lasso.js Demo</h1>
    <!-- <lasso-body> -->
    <script type="text/javascript" src="static/my-page-2e3e9936.js"></script>
    <script type="text/javascript">$rmod.ready();</script>
    <!-- </lasso-body> -->
</body>
</html>
```

With the `--production` option enabled, all of the resources are concatenated together, minified and fingerprinted – perfect for high performance web applications running in production.

### Configuration

`lasso-config.json:`

```js
{

    "plugins": [
        "lasso-less"
    ],
    "outputDir": "static",
    "fingerprintsEnabled": true,
    "minify": true,
    "resolveCssUrls": true,
    "bundlingEnabled": true,
    "bundles": [
        {
            "name": "jquery",
            "dependencies": [
                "require: jquery"
            ]
        },
        {
            "name": "math",
            "dependencies": [
                "require: ./add"
            ]
        }
    ]
}
```

In addition, let's put our page dependencies in their own JSON file:

`my-page.browser.json`

```js
{
    "dependencies": [
        "./style.less",
        "require-run: ./main"
    ]
}
```

Now run the page lasso using the newly created JSON config file and JSON dependencies file:

```sh
lasso ./my-page.browser.json \
    --inject-into my-page.html \
    --config lasso-config.json
```

## Dependencies

Lasso.js walks a dependency graph to find all of the resources that need to be bundled. A dependency can either be a JavaScript or CSS resource (or a file that compiles to either JavaScript or CSS) or a dependency can be a reference to a set of transitive dependencies. Some dependencies are inferred from scanning source code and other dependencies can be made explicit by listing them out in the code of JavaScript modules or in separate `browser.json` files.

Dependencies can be "required" inside a JavaScript module as shown in the following sample JavaScript code:

`require('./style.less');`

To prevent Node.js from trying to load a Less file or other non-JavaScript files as JavaScript modules you can add the following code to your main script:

`require('lasso/node-require-no-op').enable('.less', '.css');`

### Conditional Dependencies

Lasso.js supports conditional dependencies. Conditional dependencies is a powerful feature that allows for a page to be built differently based on certain flags (e.g. `"mobile device"` versus `"desktop"`).

```js
{
    "dependencies": [
        { "path": "./hello-mobile.js", "if-flag": "mobile" }
    ]
}
```

or NOT enabled.

```js
{
    "dependencies": [
        { "path": "./hello-desktop.js", "if-not-flag": "mobile" }
    ]
}
```

If needed, a JavaScript expression can be used to describe a more complex condition as shown in the following sample code:

```js
{
    "dependencies": [
        {
            "path": "./hello-mobile.js",
            "if": "flags.contains('phone') || flags.contains('tablet')"
        }
    ]
}
```

### Enabling Flags

The code below shows how to enable flags when optimizing a page:

Using the JavaScript API:

```js
myLasso.lassoPage({
    dependencies: [
        { path: './hello-mobile.js', 'if-flag': 'mobile' }
    ],
    flags: ['mobile', 'foo', 'bar']
})
```

Using the Marko taglib:

```html
<lasso-page ... flags="['mobile', 'foo', 'bar']">
    ...
</lasso-page>
```

## Lassoing a page

For added flexibility there is a JavaScript API that can be used to lasso pages as shown in the following sample code:

```js
var lasso = require('lasso');
lasso.configure('lasso-config.json');
lasso.lassoPage({
        name: 'my-page',
        dependencies: [
            "./style.less",
            "require-run: ./main"
        ]
    },
    function(err, lassoPageResult) {
        if (err) {
            // Handle the error
        }

        var headHtml = lassoPageResult.getHeadHtml();
        // headHtml will contain something similar to the following:
        // <link rel="stylesheet" type="text/css" href="static/my-page-169ab5d9.css">

        var bodyHtml = lassoPageResult.getBodyHtml();
        // bodyHtml will contain something similar to the following:
        //  <script type="text/javascript" src="static/my-page-2e3e9936.js"></script>
    });
```

### Optimizing a Page

The following code illustrates how to lasso a simple set of JavaScript and CSS dependencies using the default configured lasso:

``js
var lasso = require('lasso');
lasso.lassoPage({
        name: 'my-page',
        dependencies: [
            './foo.js',
            './bar.js',
            './baz.js',
            './qux.css'
        ]
    },
    function(err, lassoPageResult) {
```

### Creating a New Lasso

To create a new Lasso configuration for a page, use `lasso.create`

```js
var myLasso = lasso.create(config);
myLasso.lassoPage(...);
```

### Lasso.js with Marko

```sh
npm install lasso --save
npm install marko --save
```

You can now add the lasso tags to your page templates.

```html
<lasso-page package-path="./browser.json"/>
...
<body>
    <h1>Test Page</h1>
    <lasso-body/>
</body>
```

The output of the page rendering will be similar to the following:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test Page</title>
    <link rel="stylesheet" type="text/css" href="/static/my-page-85e3288e.css">
</head>
<body>
    <h1>Test Page</h1>
    <script type="text/javascript" src="/static/bundle1-6df28666.js"></script>
    <script type="text/javascript" src="/static/bundle2-132d1091.js"></script>
    <script type="text/javascript" src="/static/my-page-1de22b65.js"></script>
</body>
</html>
```

The lasso result is cached so you can skip the build step!

See [static](https://github.com/koajs/static)

`app.use(require('koa-static')(root, opts));`

Where
- `root` root directory (string).
- `opts` options object.

Nothing above this `root` directory can be served

Also see [static cache](https://github.com/koajs/static-cache) middlewares for Koa server.

```js
app.use(staticCache(path.join(__dirname, 'public'), {
  maxAge: 365 * 24 * 60 * 60
}))
```

You can also configure the default page lasso used by the lasso tags:

`require('lasso').configure({...});`

### Client/Server Template Rendering

```js
var template = require('marko')
    .load(require.resolve('./template.marko'));

template.render(
    {
```

require.resolve() is used to get the resolved path for the template and the marko module uses that path to load template into memory.

In order to automatically detect and compile required *.marko templates we will need to install the `lasso-marko` plugin using the following command:

`npm install lasso-marko`

We can then lasso the page using the following command:

```sh
lasso style.less \
    --main main.js \
    --inject-into my-page.html \
    --plugins lasso-marko
```

For more details, please see [Lasso.js Taglib for Marko](https://github.com/lasso-js/lasso/blob/master/taglib-marko.md)

### Runtime Optimization with Express/Koa

Lasso.js has a smart caching layer and is fast enough so that it can be used at runtime as part of your server application. The easiest way to use Lasso.js at runtime is to use the taglib and simply render the page template to the response output stream.

The first time the page renders, the page will be lassoed and cached and the output of the lasso will be used to produce the final page HTML. After the first page rendering, the only work that will be done by Lasso.js is a simple cache lookup.

By default, Lasso.js writes all resource bundles into the static/ directory at the root of your application. In addition, by default, all resource URLs will be prefixed with `/static`. If resources are to be served up by the local Express server we will need to register the appropriate middleware as shown in the following sample code:

```js
// Load the page template:
var template = require('marko').load(require.resolve('./template.marko')

// Any URL that begins with "/static" will be served up
// out of the "static/" directory:
app.use('/static', serveStatic(__dirname + '/static'));
```

### Bundling

By default, all dependencies required for a page will be bundled into a single JavaScript bundle and a single CSS bundle. However, Lasso.js allows application-level bundles to be configured to allow for consistent bundles across pages and for multiple bundles to be included on a single page. Because Lasso.js also generates the HTML markup to include page bundles, the page itself does not need to be changed if the bundle configuration is changed.

### Code Splitting

Lasso.js supports splitting out code that multiple pages/entry points have in common into separate bundles. This is accomplished by assigning an intersection dependency to a bundle. The intersection dependency is a package dependency that produces a set of dependencies that is the intersection of one or more packages. Code splitting ensures that the same code is not downloaded twice by the user when navigating a web application.

The following bundle configuration illustrates how to split out common code into a separate bundle:

```js
{
    "bundles": [
        {
            "name": "common",
            "dependencies": [
                {
                    "intersection": [
                        "./src/pages/home/browser.json",
                        "./src/pages/profile/browser.json"
                    ]
                }
            ]
        }
    ]
}
```


## Page bundling

[Lasso.js](https://github.com/lasso-js/lasso) will be used for *Page bundling*.

Note: See [lasso bundler](https://github.com/smigit/rapid-render/tree/master/docs/lasso-bundler.md) for a features overview

The page `render` function could look something like this, where `name` is the page name:

Each page template should be stored in `views/pages/[name]/[name].marko`

```js
var pagesPath = './pages';

function pagePath(name) {
    return path.join(pagesPath, name, `${name}.marko`);
};
var template = require('marko').load();

function render(name, data) {
    template.render(data, function(err, html) {
        // html will include all of the required <link> and <script> tags
        return html;
    });
}
```

The page template `index`

`pages/index/index.marko`

```html
<lasso-page package-path="./browser.json"/>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test Page</title>
    <lasso-head/>
</head>
<body>
    <h1>Test Page</h1>
    <lasso-body/>
</body>
</html>
```

Create a `browser.json` in the same directory as your page template.
Use flags for conditional dependencies, such as per device control.

`pages/index/browser.json`

```js
{
    "dependencies": [
        "./widgetX.js",
        "./widgetY.js",
        "./style.less",
        { "path": "./hello-mobile.js", "if-flag": "mobile" }
    ]
}
```

See [enabling flags](https://github.com/lasso-js/lasso#enabling-flags)

```js
    // browser.json (page config file)
    ...
    flags: ['mobile', 'foo', 'bar']
})
```

Using Marko taglib with page flags:

```html
<lasso-page ... flags="['mobile', 'foo', 'bar']">
    ...
</lasso-page>
```

We recommend always configuring pages via the `browser.json` file to keep the HTML "clean".

### Static page caching

By default, Lasso.js writes all resource bundles into the `static/` directory at the root of your application. 
In addition, by default, all resource URLs will be prefixed with `/static`. 
If resources are to be served up by the local Express server we will need to register the appropriate middleware

Koa needs to be set up to use Static page caching, something like:

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



### Application level bundles

Lasso.js allows application-level bundles to be configured to allow for consistent bundles across pages and for multiple bundles to be included on a single page.

We will have one `common` bundle for libraries shared across most pages. 
Additionally we will have other bundles for typical widgets that form a logical group and always "go together", such as:

- coupon_widgets
- live_widgets
- casino_widgets
- header_widgets
- account_widgets
- ...

However, this does not really work, since all bundles specified in lasso config are inserted into all pages.
We need a way to specify on a per page level which common bundles that page uses. 

A solution for this is to tag pages with a set of tags to indicate the types of features goes on the page.
The bundles can then be tagged to participate in delivering certain features. 
This tag strategy achieves lose coupling!

Tagged bundles are being resolved as per [issue #59](https://github.com/lasso-js/lasso/issues/59)


```js
    // pages/coupons/browser.json
    ...
    tags:  ['coupons', 'live']
    flags: ['mobile', 'foo', 'bar']
    dependencies: [
        ...
    ]
})
```

Sample Application lasso configuration:

```js
// lasso-config.js
{
    // Configure Lasso.js plugins
    "plugins": [
        // Plugin with a default config:
        "lasso-marko",
        "lasso-sass",
        "lasso-stylus",
        "lasso-jsx",
        "lasso-imagemin"
    ],
    // The base output directory for generated bundles
    "outputDir": "static",

    // Optional URL prefix to prepend to relative bundle paths
    "urlPrefix": "http://mycdn/static",

    // If fingerprints are enabled then a shasum will be included in the URL.
    // This feature is used for cache busting.
    "fingerprintsEnabled": true,

    // If fingerprints are not enabled then the same output file would be
    // used for bundles that go into the head and bundles that go in the
    // body. Enabling this option will ensure that bundles have unique names
    // even if fingerprints are disabled.
    "includeSlotNames": false

    // If "minify" is set to true then output CSS and JavaScript will run
    // through a minification transform. (defaults to false)
    "minify": true,

    // If "resolveCssUrls" is set to try then URLs found in CSS files will be
    // resolved and the original URLs will be replaced with the resolved URLs.
    // (defaults to true)
    "resolveCssUrls": true,

    // If "bundlingEnabled" is set to true then dependencies will be concatenated
    // together into one or more bundles. If set to false then each dependency
    // will be written to a separate file. (defaults to true)
    "bundlingEnabled": true,

    // If you want consistent bundles across pages then those shared bundles
    // can be specified below. If a page dependency is part of a shared
    // bundle then the shared bundle will be added to the page (instead of
    // adding the dependency to the page bundle).
    "bundles": [
        {
            "name": "common",
            "dependencies": [
                "./zepto.js",
                "./xyz.js"
            ]
        },
        {
            "name": "coupon-widgets",
            "tags": ["coupons"],
            "dependencies": [
                {
                    "threshold": 2,
                    "intersection": [
                        "require: ./coupons/topTengames",
                        "require: ./coupons/randomBet",
                        "require: ./coupons/betslip"
                    ]
                }
            ]
        }
        // other widget groups
        ...
    ]
}
```

## Testing

For testing we could use Karma Lasso?

- [karma-lasso](https://github.com/lasso-js/karma-lasso) is used for testing pages.

```js
// karma.conf.js
module.exports = function (config) {
    config.set({
        browsers: [
            'PhantomJS'
        ],
        // for generating coverage reports, add lasso as a reporter in config
        reporters: [
            'mocha',
            'lasso'
        ],
        // specify the config to be passed to lasso in the lasso key
        lasso: {
            plugins: [
                'lasso-marko',
                'lasso-sass',
                ...
            ],
            minify: false,
            bundlingEnabled: false,
            resolveCssUrls: true,
            cacheProfile: 'development',

            // directory where all the generated files will be stored.
            tempdir: './.coverage',

            // enables coverage
            coverage: {
                // glob pattern of files for which coverage report is to be generated
                files: 'src/**/*.js',

                // Specify the reporters to be used for coverage output.
                // All Istanbul reporters are supported
                reporters: [
                    {
                        type: 'json',
                        dir: './.coverage/json/'
                    },
                    {
                        type: 'html',
                        dir: './.coverage/html-client/'
                    }
                ]
            }
        }
    });
}
```

TODO: more reasearch and experimentation...

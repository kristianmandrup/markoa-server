# Marko Rendering and Templating

Async, Out-of Order, Streamed, Compressed Fragments!!

Marko has several **killer features** that set it apart:

*  **streamed** template **rendering**, which **sends** your html **content** to the browser **early** and **often**.
*  **asynchronous rendering** of html **fragments**, which basically means you define sections of your template as asynchronous and you _let Marko_ _handle_ the _waiting_, _buffering_ and eventual _rendering_.
*  **out of order rendering** while still displaying the html content in _correct order_. This means that as soon as your asynchronous _queries_ _complete_, Marko will _render_ the relevant portions of the template and _send_ it _to_ the _browser_, even if this means sending the content out of the final display sequence. Then Marko displays the content in the correct sequence by using client side JavaScript.
These three **features** in combination **result** in **huge gains** in **perceived** and **actual** loading **performance** particularly when used on multi-page web applications that serves dynamic content.

The **reason** for the significant performance gains is because Marko is **designed** to **leverage Progressive Rendering** in the browser, a feature supported by all modern browsers.

The idea behind Progressive Rendering is that the **browser** should attempt to **paint** or render as much of the **page** as can as **early** as possible.

You should really **watch** the **demo** to get a **sense** of **why** _Progressive Rendering_ and **Marko** are so **important**.

[demo screencast](http://knowthen.com/episode-8-serving-content-in-koajs-with-marko/)

Marko consists of a number of small, dedicated Node.js modules:

- [Marko async](https://github.com/raptorjs/marko-async) rendering
- [view engine](https://github.com/raptorjs/view-engine-marko)
- [async-writer](https://github.com/raptorjs/async-writer)
- [Marko layout](https://github.com/raptorjs/marko-layout)
- [Lasso.js](https://github.com/lasso-js/lasso)

*Lasso.js* is a Node.js-style JavaScript module bundler that also provides first-level support for optimally delivering JavaScript, CSS, images and other assets to the browser. Provides bundling, code splitting, lazy loading, conditional dependencies, compression and fingerprinted resource URLs.

[marko-widgets](https://github.com/raptorjs/marko-widgets) can be used for Isomorphic Reactive UIs with [better performance characteristics than React on all levels](https://github.com/patrick-steele-idem/marko-vs-react).

[Atom marko plugin](https://github.com/raptorjs/atom-language-marko)

### Loading templates

Marko provides a custom Node.js require extension that allows Marko templates to be required just like a standard JavaScript module.

```js
require('marko/node-require').install();

// Load a Marko template by requiring a .marko file:
var template = require('./template.marko');
```

### Rendering

```js
var template = require('./template.marko');
template.render({
        name: 'Frank',
        count: 30
    },
    function(err, output) {
        if (err) {
            console.error('Rendering failed');
            return;
        }

        console.log('Output HTML: ' + output);
    });
```

### Streamed Rendering

Streaming API

Streaming is recommended as the best rendering approach for most (high performance) scenarios!

```js
var template = require('./template.marko');
var page = 'index.html';
var out = require('fs').createWriteStream(page, {encoding: 'utf8'});

var data =  {
    name: 'Frank',
    count: 30
}

// Render the template to 'index.html'
template.stream(data)
    .pipe(out);
```


Alternatively, you can render directly to an existing stream to avoid creating an intermediate stream.

```js
var template = require('./template.marko');
var out = require('fs').createWriteStream(page, {encoding: 'utf8'});

// Render the template to 'index.html'
template.render(data, out);
```

### Template Compilation

The Marko compiler produces a Node.js-compatible, CommonJS module as output. This output format has the advantage that compiled template modules can benefit from a context-aware module loader and templates can easily be transported to work in the browser using *Lasso.js* or *Browserify*.

#### Sample Compiled Template

As you can see, inside a template all attributes are to be referenced on the `data` object.

```js
exports.create = function(__helpers) {
  var empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      forEach = __helpers.f,
      escapeXmlAttr = __helpers.xa;

  return function render(data, out) {
    out.w('Hello ' +
      escapeXml(data.name) +
      '! ');
```

Rapid Render automatically watches all files in the `/views` folder and precompiles them. This makes it easy to debug any templating errors, as you can simply insert debug statements directly into the generated `.js` files to follow what is going on.

## Marko Language overview

### Directives

Marko templating *directives* can be used as either an attribute or as an element.

Attribute directive `for="..."`

```html
<li for="color in colors">
    $color
</li>
```

Element directive `<for each="..."`

```html
<for each="color in colors">
    <li>
        $color
    </li>
</for>
```

### Dynamic expressions

Dynamic text is supported using either `$<variable-reference>` or `${<javascript-expression>}`

### Expressions

To make it easier for junior FE developers, some boolean expresion aliases are available to make it more clear: 
- `&&  and`
- `===  eq`
- `!== ne`
- `> gt`
- `< lt`

`if="${user.isLoggedIn and beslip.isActive}"`

```html
<div if="searchResults.length gt 100">
    Show More
</div>
```

### Includes

You can include templates (partials) via the include tag.

`<include template="./greeting.marko" name="Frank" count="30"/>`

*WARNING*

It is tempting to try to pass the whole data context directly down, however that won't work.

`<include template="./greeting.marko" data="$data"/>`

Instead always reference the local data to be passed down:

`<include template="./greeting.marko" menuItems="$data.menuItems"/>`

For more details see the [includes](https://github.com/raptorjs/marko#includes) section of the marko docs.

Alternatively, you can pass the template data using the `template-data` attribute. The value must be a JavaScript expression that resolves to the template data as shown below:

`<include template="./greeting.marko" template-data="{ name: 'Frank', count: 30 }"/>`

To pass the entire `data` down:

`<include template="./greeting.marko" template-data="$data"/>`

### Layouts

Please see the [layouts docs](https://github.com/raptorjs/marko-layout) for detailed up to date documentation.

A layout is defined as a standard Marko template with special `<layout-placeholder>` tags.

```html
...
    <layout-placeholder name="footer">
        This is the default content for the "footer" placeholder. If
        no "footer" content is provided by the caller then this content will
        be rendered.
    </layout-placeholder>
...
```

### Using a layout

The `<layout-use>` tag is used to render a layout template with content being provided by the caller.

`template` is the path to the layout template or a JavaScript expression that resolves to a loaded template instance.

Any remaining attributes can be used to provide additional data to the layout template

```html
...
<layout-use template="./default-layout.marko" show-header="${data.displayHeader}">
    ...
</layout-use>
```

The `<layout-put>` tag is used to provide layout content to the named placeholders of the layout.

`into` (required) - The name of a placeholder that the content should replace
`value` (optional) - The content that should be used. If not provided, the nested content is used.

`<layout-put into="title">My Page</layout-put>` or `<layout-put into="title" value="My Page"/>`

### Layout data

Additional data can be provided to a layout template by the caller. Data is separate from content and be used to control how the layout renders. Layout data will be accessible as properties in the standard data variable.

Any additional attributes other than the `template` attribute that are provided to the `<layout-use>` tag are used to pass additional data to a layout template.

<layout-use template="./default-layout.marko" show-header="$true">
    ...
</layout-use>

NOTE: All data attributes will be de-hyphenated and converted to camel case (e.g., `show-header` will be accessible via the `showHeader`property on the data object).

Essentially the rules for passing data to a layout is the same as for any other template.

### Dynamic template inclusion

The value of the `template` attribute can also be a dynamic JavaScript expression that resolves to a loaded template as shown below:

```js
var myIncludeTarget = require('./my-include-target.marko');
var anotherIncludeTarget = require('./another-include-target.marko');

template.render({myIncludeTarget: myIncludeTarget})
```

And then in your template:

```html
<include template="${data.myIncludeTarget}" name="Frank" count="30"/>
<include template="${data.anotherIncludeTarget}" name="Frank" count="30"/>
```

You can also choose to load the `include` target within the calling template as shown below:

```html
<require module="./my-include-target.marko" var="myIncludeTarget" />
...
<include template="${data.myIncludeTarget}" name="Frank" count="30"/>
```

### Variables

`<var name="name" value="data.name.toUpperCase()" />`

To assign a new value

`<assign var="name" value="data.name.toLowerCase()" />`

### Conditionals

Are discouraged! Use Custom tags or macros instead.

```html
<if test="test === 'a'">
    <div>
        A
    </div>
</if>
```

### Shorthand conditionals

May be used for quick prototyping...

`{?<expression>;<true-template>[;<false-template>]}`

For example:

`<div class="{?active;tab-active}">Hello</div>`

With a value of `true` for `active`, the output would be the following:

`<div class="tab-active">Hello</div>`

### Looping

The directive `for` can be applied as an attribute:

```html
<ul>
    <li for="item in items">${item}</li>
</ul>
```

or as an element:

```html
<ul>
    <for each="item in items">
        <li>${item}</li>
    </for>
</ul>
```

Use with separator:

`<for each="color in colors" separator=", ">$color</for>`

And with properties in objects:

```html
<li for="(name,value) in settings">
    <b>$name</b>:
    $value
</li>
```

You can even crerate Custom iterators (functions)

## Macros

Macros are defined via `def`

```html
<def function="greeting(name, count)">
    Hello $name! You have $count new messages.
</def>
<p>
    ${greeting("John", 10)}
</p>
<invoke function="greeting('Frank', 20)"/>
```

### Structure Manipulation

The `attrs` attribute allows attributes to be dynamically added to an element at runtime. 
`myAttrs = {style: "background-color: #FF0000;", "class": "my-div"}`

```html
<div attrs="myAttrs">
    Hello World!
</div>
```

If you find that you have a wrapper element that is conditional, but whose body should always be rendered then you can use the `body-only-if` attribute to handle this use case.

### Helpers

Are defined as CommonJS modules

```js
// src/util.js:

exports.reverse = function(str) {
    var out = "";
    for (var i=str.length-1; i>=0; i--) {
        out += str.charAt(i);
    }
    return out;
};
```

Then required into a template and used:

```html
<require module="./util" var="util" />
<div>${util.reverse('reverse test')}</div>
```

### Globals

The `$global` property is used to add data that is available to all templates encountered during rendering by having the data hang off the wrapped writer.

```js
template.render({
    $global: {
        name: 'Frank'
    }
}, res);
```

And used like this, referencing on `out` directly!

```html
<div>
    Hello ${out.global.name}!
</div>
```

## Custom Tags and Attributes

A custom tag or a custom attribute must have at least one dash to indicate that is not part of the standard HTML grammar.
Example: `<my-hello>`


```html
<div>
    <my-hello name="World"/>
</div>
```

To create a custom tag,simply create a module that exports a function with the following signature:

```js
exports.render = function(input, out) {
    out.write('Hello ' + input.name + '!');
}
```

The custom tag can render the body it wraps if needed.

```js
exports.render = function(input, out) {
    out.write('BEFORE BODY');
    if (input.renderBody) {
        input.renderBody(out);
    }
    out.write('AFTER BODY');
}
```

A tag renderer can be mapped to a custom tag by creating a `marko-taglib.json`

```js
{
    "<my-hello>": {
        "renderer": "./hello-renderer",
        "@name": "string"
    }
}
```

A custom tag can reference either a renderer function, a template or even another tag definition from a json file.

```js
{
    "<my-hello>": {
        "renderer": "./hello-renderer",
        "@name": "string"
    },
    "<my-foo>": {
        "renderer": "./foo-renderer",
        "@*": "string"
    },
    "<my-bar>": "./path/to/my-bar/marko-tag.json",
    "<my-baz>": {
        "template": "./baz-template.marko"
    }
}
```

If you provide attributes then the Marko compiler will do validation to make sure only the supported attributes are provided. A wildcard attribute ("@*") allows any attribute to be passed in. Below are sample attribute definitions:

```js
{
    "@message": "string",     // String
    "@my-data": "expression", // JavaScript expression
    "@*": "string"            // Everything else will be added to a special "*" property
}
```

For more details, see [custom tags official docs](https://github.com/raptorjs/marko#custom-taglibs)

### Nested tags

Nested tags can be declared in the parent tag's `marko-tag.json` as shown below:

```js
// ui-tabs/marko-tag.json
{
    "@orientation": "string",
    "@tabs <tab>[]": {
        "@title": "string"
    }
}
```

## Taglib Discovery

Given a template file, the marko module will automatically discover all taglibs by searching relative to the template file. The taglib discoverer will search up and also look into `node_modules` to discover applicable taglibs.

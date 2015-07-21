# Render

## RenderStrategies

`render-strategies` can configure some basic Render strategies.
Currently only a `streamed` strategy is implemented.

## RenderConfig

`render-config` has a `builder` function used to build a render function. The render function must ensure that it can use an appropriate `findPageTemplate` function for the given page to render.

The `render` function will find the Marko template for the page and pass the page data to the template.

```js
function(response, pageName, pageData) {
  var pageTemplate = this.findPageTemplate(pageName);
  this.log('rendering template, data:', pageTemplate, pageData);
  response.body = this.render(pageTemplate, pageData);
  response.type = 'text/html';
};
```

# Frontend developer workflow
The Rapid Render server has been designed to better accomodate the FE developer workflow.

A Frontend dev should operate:
- autonomously
- in a FE dev only environment
- without access to external services (or data)
- without touching any server logic
- only on FE assets: templates, stylesheets, js files
- using simple tools specific to FE dev tasks
- using any web development IDE or editor

## Design to application
A new design for an application is delivered as web assets in the form of UI/UX illustrations and descriptions.
How do we most most efficiently convert this to a web application?

Ideally we should develop
- prototype UI (wireframes)
- prototype data
- prototype APIs
- QA E2E testing of "static" prototype app

Progressively
- convert of partials into dynamic applications using best FE frameworks/libs of the day (React etc.)
- connect prototype API configs to real backend services

## Application to design
In some cases we might have existing dynamic applications (widgets) which we need to use as reference (HTML, CSS) for initial page rendering.

In this case:
- convert application templates into Marko templates
- convert application state model into Marko `data` object sent to page template
- configure Koa data config to use application data providers (Ajax)
- convert application rendering logic to Marko logic
- convert application styling to Koa page styling

### Page application

Ideally, each page should be rendered with placeholders for either:
- each sub-application (widget)
- all the components of a Single Page Application (SPA)

The widget approach can be used for prototyping, but widgets should be aggregated into full SPAs gradually.
This way each SPA can leverage (reuse) the state model of the page for the Isomorphic page render which is the optimal solution.

### Models, Views and View-Models

Primitive Data Models can be designed purely as YAML or JSON files by the FE developer. These files are then aggregated into the data model for each page and used in the rendering process by reference via `${}` expressions and `for` loops to iterate/navigate and display the data on the page as needed.

The Views are the pages in form of `.marko` templates and the partials (or custom tags). Each view is given a view model. For the page it is the entire page state, while parts of the page are given relevant parts of the page state to render. It is clear that this approach 
maps beautifully to a Reactive (full state render) approach such as React (with Virtual DOM) or [Marko widgets](https://github.com/raptorjs/marko-widgets)

### CSS styles

- use bootstrap classes for app by default
- for development use default bootstrap theme
- the site containing the app has the own favourite bootstrap theme
- if at the site it's required to add custom (not bootstrap) styles - in the app the appropriate css class should be for each element. Naming convention is based on ['bem' methodology](https://en.bem.info/articles/learning-to-love-bem/).

### Files

The FE dev should only operate on the following files of the Rapid Render app:

```
/model
  data.js
  /data
    - menuItems.json
    - ...

/config
  - pages.yml

/views
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

/public
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

Note that by convention:
- partials are prefixed with `_` like `_header.marko`.
- layouts are postfixed with `-layout` like `default-layout.marko`

In the first few iterations keep it simple and use only: pages, layout and partials.

As the HTML stabilizes look to optimize/simplify the HTML and Marko logic:
- convert partials into custom tags
- introduce custom directives (custom attributes)
- introduce custom helpers
- use [fonticons](fonticons.com) for custom vector based fonts

Have fun :)

# Server State Object

```js
// the app state
// for each page
{
  content: {
  },
  global: {
    title: "Forvetbet",
    logo: "logo.png",
    ...
  },
  page: {
    ...
  },
  providers: {
    ...
  },
  // user session data
  sessions: {
    // type of user
    guest: {}, // NOT logged in
    basic: {}, // logged in
    ...
  },
  stores: {
    // functions to retrieve data on demand
    cms: {
      articles: fn(),
      ...
    },
    coupons: {
      topTenGames: fn(),
      ...
    }
  }
}
```
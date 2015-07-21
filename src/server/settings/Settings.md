# Settings

The `Settings` class should be used to create Koa server settings:
- port number
- secrets
- root path of server
- middleware to be used

## Default settings

When the Server is started it will use the default settings specified in `dfaults.js` and `middleware-conf.js`.

```json
{
  port: 4000,
  secret: {
    session: 'haTd3Yw9IfSGpM5VfY9srGOd2N92GJ2aT4'
  },
  rootPath: this.rootPath,
  middleware: [
    'compression',
    'csrf',
    'jwt',
    ...
  ]
}
```

## Custom settings

You can override these server settings by calling `server.settings.configure({...})` with a settings object.

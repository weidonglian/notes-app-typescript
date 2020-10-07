# Back-end

## Postgres database

If you have not start `postgres` database, you can start by your own. Depending on your system.

- On Windows, you have to install it manually and start it up.
- On Mac & Linux, you need to install docker first and then run the following command.

```bash
yarn db-start
yarn db-create-all # only run it the first time
```

## Useful commands

```bash
yarn start
yarn test
```

You could find all the commands in package.json.

## Test

In order to debug the failing tests using jest, you could run jest in watch mode.

### Logging in jest

You could enable or disable the logs in testing by setting in testApp.ts

```javascript
const consoleMock = spyOnConsole(true)
```

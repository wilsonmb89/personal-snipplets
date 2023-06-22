# bbog-pb-frontend-settings-app

[![node](https://img.shields.io/badge/node-v14.17.13-green.svg)](https://nodejs.org)
[![npm](https://img.shields.io/badge/npm-6.X-green.svg)](https://www.npmjs.com/)

> This project contains the Banca virtual, Banco de Bogotá settings microfrontend code.
>
> Developed with all :heart: in the world by ADL DevOps team

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](http://git-scm.com/)
- [Node](https://nodejs.org)

### Standalone mode

To run the project in standalone mode just run the start command:

```
npm run start
```

the app will be running on [http://localhost:4202/](http://localhost:4202/)

### Microfrontend Mode

To run the project in microfrontend mode, you should run the [bbog-pb-frontend-bv-shell](https://github.avaldigitallabs.com/avaldigitallabs/bbog-pb-frontend-bv-shell) project and then, run this project with the following command:

```
npm run serve:mf:dev
```

## Build

---

The build can be achieved by running:

```
npm run build
```

The project will be transpiled as a microfrontend in `development` mode by default, but you can change it by updating `$REACT_APP_ENV` in your machine env variables.

## Contributing

If you find this repo useful here's how you can help:

1. Send a Merge Request with your awesome new features and bug fixes
2. Wait for a Coronita :beer: you deserve it.

## Further Reading / Useful Links

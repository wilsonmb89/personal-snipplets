# authentication-app

[![node](https://img.shields.io/badge/node-v11.3.X-yellow.svg)](https://nodejs.org)
[![npm](https://img.shields.io/badge/npm-6.X-green.svg)](https://www.npmjs.com/)

> This project contains the source example template for microfrontends with `module-federation` and `react`
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

the app will be running on [http://localhost:4205/](http://localhost:4205/)

### Microfrontend mode

To run the project in microfrontend mode, you should have running a `authentication-app` project and then, run this project with the following command:

```
// in dev environment
npm run start:mf:local
```

## Build

The pipeline in this project knows in wich environment is beeing deployed, when you run the following command in your local machine it will be running a dev build:

```
npm run build
```

the output of the transpiling process will be inside of the `./build` folder

## Contributing

If you find this repo useful here's how you can help:

1. Send a Merge Request with your awesome new features and bug fixes
2. Wait for a Coronita :beer: you deserve it.

## Further Reading / Useful Links

- [Pipeline video documentation](https://classroom.google.com/u/0/c/Mzc3OTUwNDQyNDJa/m/MjgxNzk2Mjg1NjU4/details)
- [Shell repository](https://github.com/avaldigitallabs/devops-pipeline-react-shell-example)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [React Documentation](https://reactjs.org/)

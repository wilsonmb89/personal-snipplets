# bbog-pb-frontend-legacy-app

This project contains a react microfrontend example template.

## Getting started

---

This project uses module federation, because of that, it can be run in two modes:

### Standalone mode

To run the project in standalone mode just run the start command:

```
npm run start
```

### Microfrontend Mode

To run the project in microfrontend mode, you should run the `devops-pipeline-react-shell-example` project and then, run this project with the following command:

```
npm run serve:microfrontend
```

## Build

---

A production build can be achieved by running:

```
npm run build
```

The project will be transpiled as a microfrontend in production mode

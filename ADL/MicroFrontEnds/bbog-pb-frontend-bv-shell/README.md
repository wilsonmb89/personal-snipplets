# bbog-pb-frontend-bv-shell

This project contains the main shell for microfrontends.

## Getting started

---

The shell is the entry point to run all the microfrontends, it doesn't have multiple modes as microfrontends have, but you should run in your local environment the following projects as microfrontend mode:

- `devops-pipeline-react-mf-example`

Once these projects are running, run the following command to launch the application in your machine:

```
npm run start
```

for running the shell with `staging` configuration, please run:

```
npm run serve:stg
```

## Build

---

A production build can be achieved by running:

```
npm run build
```

The project will be transpiled in production mode at `dist` path

# Development

This document describes the process for setting up and running this app on your local computer.

## Prerequisites

This app uses Node.js.

You can get Node.js [here](https://nodejs.org/en/), or if you are using Chocolatey run `choco install nodejs`.

It runs on MacOS, Windows, and Linux environments.

## Linting

ESLint is used for Typescript linting. To lint the Typescript code, run `npm run lint`. To only lint for errors (excluding warnings), run `npm run lint-errors-only`.

## Building

To build the app's Typescript, run `npm run build-dev`

## Running

### Development

To run the `hello` command in a development environment, run `npm run hello-dev "Joe Bloggs"`

## Debugging

There is VSCode debug configuration for the `hello` example command called **hello command**.

## Pull Requests

Pull requests automatically run a CI pipeline that checks various criteria:

* Linting
* Typescript build
* Unit tests

These must pass for a pull request to be approved and merged.

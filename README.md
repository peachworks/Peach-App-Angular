Peach-App
=========

Base project for developer apps.

Technology stack:

NPM & Bower

Gulp

Karma Testing

Angular 1.4

ngNewRouter

ES6


# Setup

First step after you clone the repository is to install the dependencies.  You will need Node & NPM installed to continue.

```
$ npm install -g gulp bower
$ npm install
```


# Commands

You have a series of pre-configured commands you can leverage in your development.

To launch a local server where you can make changes to the code and have the browser auto-refresh:

```
$ gulp serve
```

To launch a local server that builds the files for production first:

```
$ gulp serve:dist
```

To launch unit tests:

```
$ gulp test
```

To launch end-to-end tests:

```
$ gulp protractor
```

To build:

```
$ gulp build
```

Peach-App
=========

Base project for developer apps.

Technology stack:

NPM & Bower

Gulp

Karma Testing

Angular 1.3

Angular Material

ES6


# Setup

First step after you clone the repository is to install the dependencies.  You will need Node & NPM installed to continue.

```
$ npm install -g gulp bower
$ npm install
```


## Commands

| Command | Results |
|---------|------------|
| gulp    | Clean & Build |
| gulp clean | Delete the contents of the .tmp/ & dist/ directories |
| gulp serve | Launches dev version of the app with live refresh as changes are made (Preferred: See `gulp test:tdd`) |
| gulp serve:dist | Launches production version of the app on a local server |
| gulp build | Rebuild files into dist/ |
| gulp test   | Run unit tests with coverage reporting |
| gulp test:tdd   | Run unit tests continuously with coverage reporting |


## ToDo

Add in namespaced commands for app, widgets, etc as we begin development on them

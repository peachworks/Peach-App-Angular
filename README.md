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

Note: The reason for :app versions is so we can easily add in :widget and other types as we add in their support


gulp                  Default task, calls clean then build


gulp serve            Alias for gulp:serve:app

gulp serve:app        Launches dev version of the app with live refresh as changes are made

gulp serve:app:dist   Launches production version of the app on a local server


gulp build            Builds all projects (App only, at the moment)

gulp build:app        Builds the app for production


gulp clean            Cleans the tmp and dist directories

gulp clean:app        Cleans the app directories beneath tmp and dist


gulp test             Launches unit tests on all

gulp test:app         Launches unit tests on the app


# ToDo

Once Angular-New-Router is on bower, it needs:

To be moved from package.json to bower.json

To be removed from index.html

In gulp/server.js, remove the line adding node_modules to the routes list

In gulp/unit-tests, remove newRouter from the testFiles list

Fix dist build...its busted until angular-new-router is actually in bower

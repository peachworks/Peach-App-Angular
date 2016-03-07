class MainController {
  constructor() {
    this.title = 'Main Page';
  }
}

MainController.$inject = [];

export default {
  controller: MainController,
  controllerName: 'MainController',
  controllerAs: 'main',
  name: 'Main',
  template: require('./main.html')
};

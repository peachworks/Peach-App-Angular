class SetupController {
  constructor() {
    this.title = 'Setup Page';
  }
}

SetupController.$inject = [];

export default {
  controller: SetupController,
  controllerName: 'SetupController',
  controllerAs: 'setup',
  name: 'Setup',
  template: require('./setup.html')
};

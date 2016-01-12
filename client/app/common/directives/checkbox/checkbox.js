inputDirective = inputDirective[0];

var CHECKED_CSS = 'md-checked';
var DEFAULT_STATES = [[true, CHECKED_CSS, 1], [false, null, 0]];

return {
  restrict: 'E',
  transclude: true,
  require: '?ngModel',
  priority:210, // Run before ngAria
  template: 
    '<div class="md-container" md-ink-ripple md-ink-ripple-checkbox>' +
      '<div class="md-icon"></div>' +
    '</div>' +
    '<div ng-transclude class="md-label"></div>',
  compile: compile
};

// **********************************************************
// Private Methods
// **********************************************************

function compile (tElement, tAttrs) {

  tAttrs.type = 'checkbox';
  tAttrs.tabindex = tAttrs.tabindex || '0';
  tElement.attr('role', tAttrs.type);

  return function postLink(scope, element, attr, ngModelCtrl) {

    var availableStates = DEFAULT_STATES;
    var currentState = availableStates[1];
    var stateChangeCallback = function(newState) { return; };
  
    ngModelCtrl = ngModelCtrl || $mdUtil.fakeNgModel();
    $mdTheming(element);

    if (attr.ngChecked) {
      scope.$watch(
        scope.$eval.bind(scope, attr.ngChecked),
        ngModelCtrl.$setViewValue.bind(ngModelCtrl)
      );
    }
    if (attr.mdCheckboxStates) {
      availableStates = scope.$eval.bind(scope, attr.mdCheckboxStates)();
      currentState = availableStates[0];
      listener(null, true);
    }
    if (attr.mdCheckboxStateChangeCallback) {
      var callback = scope.$eval.bind(scope, mdCheckboxStateChangeCallback);
      if (typeof callback == 'function') {
        stateChangeCallback = callback;
      }
    }
    if (attr.mdCheckboxInitialState) {
      scope.$watch(
        scope.$eval.bind(scope, attr.mdCheckboxInitialState),
        function(val) {
          currentState = availableStates[val];
          listener(null, true);
        }
      );
    }
    $$watchExpr('ngDisabled', 'tabindex', {
      true: '-1',
      false: attr.tabindex
    });
    $mdAria.expectWithText(element, 'aria-label');

    // Reuse the original input[type=checkbox] directive from Angular core.
    // This is a bit hacky as we need our own event listener and own render
    // function.
    inputDirective.link.pre(scope, {
      on: angular.noop,
      0: {}
    }, attr, [ngModelCtrl]);

    scope.mouseActive = false;
    element.on('click', listener)
      .on('keypress', keypressHandler)
      .on('mousedown', function() {
        scope.mouseActive = true;
        $timeout(function(){
          scope.mouseActive = false;
        }, 100);
      })
      .on('focus', function() {
        if(scope.mouseActive === false) { element.addClass('md-focused'); }
      })
      .on('blur', function() { element.removeClass('md-focused'); });

    ngModelCtrl.$render = render;

    function $$watchExpr(expr, htmlAttr, valueOpts) {
      if (attr[expr]) {
        scope.$watch(attr[expr], function(val) {
          if (valueOpts[val]) {
            element.attr(htmlAttr, valueOpts[val]);
          }
        });
      }
    }

    function keypressHandler(ev) {
      var keyCode = ev.which || ev.keyCode;
      if (keyCode === $mdConstant.KEY_CODE.SPACE || keyCode === $mdConstant.KEY_CODE.ENTER) {
        ev.preventDefault();
        if (!element.hasClass('md-focused')) { element.addClass('md-focused'); }
        listener(ev);
      }
    }
    function listener(ev, useCurrentState) {
      if (element[0].hasAttribute('disabled')) return;

      $timeout(function() {
        scope.$apply(function() {

          if (!useCurrentState) {
            currentState = availableStates[currentState[2]];
            stateChangeCallback(currentState);
          }

          ngModelCtrl.$setViewValue(currentState[0], ev && ev.type);
          ngModelCtrl.$render();

        });
      });

    }

    function render() {

      for (var i = 0; i < availableStates.length; i++) {
        element.removeClass(availableStates[i][1]);
      }

      element.addClass(currentState[1]);

    }
  };

}
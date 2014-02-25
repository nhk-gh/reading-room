'use strict';

describe('Directive: ddd', function () {

  // load the directive's module
  beforeEach(module('readingRoomApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ddd></ddd>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ddd directive');
  }));
});

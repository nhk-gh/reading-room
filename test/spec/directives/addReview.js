'use strict';

describe('Directive: addReview', function () {

  // load the directive's module
  beforeEach(module('readingRoomApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<add-review></add-review>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the addReview directive');
  }));
});

'use strict';

describe('Controller: accountController', function () {

  // load the controller's module
  beforeEach(module('readingRoomApp'));

  var AccountCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope,$dialog) {
    scope = $rootScope.$new();
    AccountCtrl = $controller('accountController', {
      $scope: scope
    });
  }));

  it('accountController should be', function () {
    expect(!!AccountCtrl).toBe(true);
  });
});

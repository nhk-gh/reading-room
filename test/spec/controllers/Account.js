'use strict';

describe('Controller: AccountController', function () {

  // load the controller's module
  beforeEach(module('readingRoomApp'));

  var AccountCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountCtrl = $controller('AccountController', {
      $scope: scope
    });
  }));

  it('AccountController should be', function () {
    expect(!!AccountCtrl).toBe(true);
  });
});

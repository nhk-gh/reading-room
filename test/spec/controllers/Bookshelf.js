'use strict';

describe('Controller: BookshelfctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('readingRoomApp'));

  var BookshelfCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BookshelfCtrl = $controller('BookshelfCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BookshelfCtrl).toBeDefined();
  });
});

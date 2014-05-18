'use strict';

describe('Service: Usersrvc', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var Usersrvc;
  beforeEach(inject(function (userSrvc) {
    Usersrvc = userSrvc;
  }));

  it('should do something', function () {
    expect(!!Usersrvc).toBe(true);
  });

});

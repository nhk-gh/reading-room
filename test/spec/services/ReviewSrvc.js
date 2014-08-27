'use strict';

describe('Service: Reviewsrvc', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var Reviewsrvc;
  beforeEach(inject(function (_ReviewSrvc_) {
    Reviewsrvc = _ReviewSrvc_;
  }));

  it('should do something', function () {
    expect(!!Reviewsrvc).toBe(true);
  });

});

'use strict';

describe('Service: Reviewsrvc', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var Reviewsrvc;
  beforeEach(inject(function (_Reviewsrvc_) {
    Reviewsrvc = _Reviewsrvc_;
  }));

  it('should do something', function () {
    expect(!!Reviewsrvc).toBe(true);
  });

});

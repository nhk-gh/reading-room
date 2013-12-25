'use strict';

describe('Service: MySrvc', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var MySrvc;
  beforeEach(inject(function (_MySrvc_) {
    MySrvc = _MySrvc_;
  }));

  it('should do something', function () {
    expect(!!MySrvc).toBe(true);
  });

});

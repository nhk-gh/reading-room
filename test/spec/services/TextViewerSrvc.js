'use strict';

describe('Service: Textviewersrvc', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var Textviewersrvc;
  beforeEach(inject(function (_Textviewersrvc_) {
    Textviewersrvc = _Textviewersrvc_;
  }));

  it('should do something', function () {
    expect(!!Textviewersrvc).toBe(true);
  });

});

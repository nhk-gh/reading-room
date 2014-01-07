'use strict';

describe('Service: Countrieslist', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var Countrieslist;
  beforeEach(inject(function (_Countrieslist_) {
    Countrieslist = _Countrieslist_;
  }));

  it('should do something', function () {
    expect(!!Countrieslist).toBe(true);
  });

});

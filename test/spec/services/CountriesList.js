'use strict';

describe('Service: Countrieslist', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var Countrieslist;
  beforeEach(inject(function (countriesSrvc) {
    Countrieslist = countriesSrvc;
  }));

  it('should do something', function () {
    expect(!!Countrieslist).toBe(true);
  });

});

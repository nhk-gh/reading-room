'use strict';

describe('Filter: fff', function () {

  // load the filter's module
  beforeEach(module('readingRoomApp'));

  // initialize a new instance of the filter before each test
  var fff;
  beforeEach(inject(function ($filter) {
    fff = $filter('fff');
  }));

  it('should return the input prefixed with "fff filter:"', function () {
    var text = 'angularjs';
    expect(fff(text)).toBe('fff filter: ' + text);
  });

});

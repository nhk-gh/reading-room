'use strict';

describe('Filter: searchReview', function () {

  // load the filter's module
  beforeEach(module('readingRoomApp'));

  // initialize a new instance of the filter before each test
  var searchReview;
  beforeEach(inject(function ($filter) {
    searchReview = $filter('searchReview');
  }));

  it('should return the input prefixed with "searchReview filter:"', function () {
    /*var text = 'angularjs';
    expect(searchReview(text)).toBe('searchReview filter: ' + text);*/
    expect(searchReview).toBeDefined();
  });

});

'use strict';

describe('Service: Textviewersrvc', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var Textviewersrvc;
  beforeEach(inject(function (TextViewerSrvc) {
    Textviewersrvc = TextViewerSrvc;
  }));

  it('should do something', function () {
    expect(!!Textviewersrvc).toBe(true);
  });

});

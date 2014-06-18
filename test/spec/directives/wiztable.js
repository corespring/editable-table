'use strict';

describe('Directive: wizTable', function () {

  // load the directive's module
  beforeEach(module('editableTableApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<wiz-table></wiz-table>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the wizTable directive');
  }));
});

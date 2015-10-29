/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.ui.admin GroupSearchService', function() {

  //USERS_CONTAINS service method
  var USERS_CONTAINS;

  //transform service method
  var transform;

  angular.module('non.existing.module', ['pr.ui.admin']).run(function(GroupSearchService, GroupRightsTransform) {
    USERS_CONTAINS = GroupSearchService.USERS_CONTAINS;
    transform = GroupRightsTransform.transform;
  });
  angular.bootstrap({}, ['non.existing.module']);

  it('GroupSearchService.USERS_CONTAINS "u" contained in ["u1","u2","u3"]', function() {
    var result = USERS_CONTAINS('u', ['u1','u2','u3']);
    expect(result).toBeTruthy();
  });

  it('GroupSearchService.USERS_CONTAINS "u1" contained in ["u1","u2","u3"]', function() {
    var result = USERS_CONTAINS('u1', ['u1','u2','u3']);
    expect(result).toBeTruthy();
  });

  it('GroupSearchService.USERS_CONTAINS "u4" contained in ["u1","u2","u3"]', function() {
    var result = USERS_CONTAINS('u4', ['u1','u2','u3']);
    expect(result).toBeFalsy();
  });

  it('GroupRightsTransform.transform process rightly', function() {
    var groupRightsRaw = [{
      rightName:'DataSource1_VIEW',
      rightType:'1'
    },{
      rightName:'DataSource1_MANAGE',
      rightType:'1'
    },{
      rightName:'DataSource2_MANAGE',
      rightType:'1'
    },{
      rightName:'DataSource3_VIEW',
      rightType:'1'
    },{
      rightName:'DashBoard1_VIEW',
      rightType:'2'
    },{
      rightName:'DashBoard1_MANAGE',
      rightType:'2'
    },{
      rightName:'DashBoard2_MANAGE',
      rightType:'2'
    },{
      rightName:'DashBoard3_VIEW',
      rightType:'2'
    },{
      rightName:'Group1_VIEW',
      rightType:'4'
    },{
      rightName:'Group1_MANAGE',
      rightType:'4'
    },{
      rightName:'Group2_MANAGE',
      rightType:'4'
    },{
      rightName:'Group3_VIEW',
      rightType:'4'
    },{
      rightName:'System1',
      rightType:'0'
    },{
      rightName:'System2',
      rightType:'0'
    }];
    var groupRightsArrInStr = [
    '1DataSource1_VIEW',
    '1DataSource1_MANAGE',
    '1DataSource2_MANAGE',
    '1DataSource3_VIEW',
    '2DashBoard1_VIEW',
    '2DashBoard1_MANAGE',
    '2DashBoard2_MANAGE',
    '2DashBoard3_VIEW',
    '4Group1_VIEW',
    '4Group1_MANAGE',
    '4Group2_MANAGE',
    '4Group3_VIEW',
    '0System1',
    '0System2'
    ];

    var transformedRights = transform(groupRightsRaw);
    var allContains = true;
    angular.forEach(transformedRights, function(right) {
      var uniqueStr = right.rightType + right.rightName + right.rightNameSuffix;
      if (groupRightsArrInStr.indexOf(uniqueStr) == -1) {
        allContains = false;
      }
    });
    expect(allContains).toBeTruthy();
  });
});

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.datasource.sql.prSqlBuilder', function() {
  var prSqlBuilder;

  beforeEach(angular.mock.module('pr.datasource.sql'));

  beforeEach(function() {
    angular.mock.inject(function($injector) {
      prSqlBuilder = $injector.get('prSqlBuilder');
    });
  });

  it('prSqlBuilder:Dataset does something',
    function() {
      var query = prSqlBuilder.buildQuery({});
      expect(query).toBeDefined();
    });

  it('prSqlBuilder:Dataset creates a statement',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session'
      });
      expect(query).toEqual('select * from pulsar_session');
    });

  it('prSqlBuilder:Dataset creates a statement with one dimension',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [{ name: 'osFamily'}]
      });
      expect(query).toEqual('select osFamily from pulsar_session group by osFamily');
    });

  it('prSqlBuilder:Dataset creates a statement with one dimension and one count metric',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'}
        ],
        metrics: [
          {name: 'pageViews', type: 'count'}
        ]
      });
      expect(query).toEqual('select count(pageViews) as "pageViews count", osFamily from pulsar_session group by osFamily order by count(pageViews) desc');
    });

  it('prSqlBuilder:Dataset creates a statement with one dimension and one sum metric ',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'}
        ],
        metrics: [
          {name: 'pageViews', type: 'sum'}
        ]
      });
      expect(query).toEqual('select sum(pageViews) as "pageViews sum", osFamily from pulsar_session group by osFamily order by sum(pageViews) desc');
    });

  it('prSqlBuilder:Dataset creates a statement with one dimension and one metric with alias',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'}
        ],
        metrics: [
          {name: 'pageViews', alias: 'My Page Views', type: 'unique'}
        ]
      });
      expect(query).toEqual('select count(distinct pageViews) as "My Page Views", osFamily from pulsar_session group by osFamily');
    });

  it('prSqlBuilder:Dataset creates a statement with two dimensions',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'},
          {name: 'osVersion'}
        ]
      });
      expect(query).toEqual('select osFamily, osVersion from pulsar_session group by osFamily, osVersion');
    });

  it('prSqlBuilder:Dataset creates a statement with two dimensions and two metrics',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'},
          {name: 'osVersion'}
        ],
        metrics: [
          {name: 'pageViews', type: 'min'},
          {name: 'ctr', type: 'sum'}
        ]
      });
      expect(query).toEqual('select min(pageViews) as "pageViews min", sum(ctr) as "ctr sum", osFamily, osVersion from pulsar_session group by osFamily, osVersion order by min(pageViews) desc');
    });

  it('prSqlBuilder:Dataset creates a statement with a simple filter - number',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'}
        ],
        where: {
          site: 0
        }
      });
      expect(query).toEqual('select osFamily from pulsar_session where site = 0 group by osFamily');
    });

  it('prSqlBuilder:Dataset creates a statement with a simple filter - string',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'}
        ],
        where: {
          country: 'usa'
        }
      });
      expect(query).toEqual('select osFamily from pulsar_session where country = \'usa\' group by osFamily');
    });

  it('prSqlBuilder:Dataset creates a statement with a simple filter - null (YEL-1570)',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'}
        ],
        where: {
          country: null
        }
      });
      expect(query).toEqual('select osFamily from pulsar_session where country is null group by osFamily');
    });

  it('prSqlBuilder:Dataset creates a statement with a filter of several parameters and values',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'}
        ],
        where: {
          site: 0,
          page: [2062918, 2064630, 2062646]
        }
      });
      expect(query).toEqual('select osFamily from pulsar_session where site = 0 and (page = 2062918 or page = 2064630 or page = 2062646) group by osFamily');
    });

  it('prSqlBuilder:Dataset creates a statement with an object filter without an operator',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'}
        ],
        where: {
          site: 0,
          page: {
            val: 2062918
          }
        }
      });
      expect(query).toEqual('select osFamily from pulsar_session where site = 0 and page = 2062918 group by osFamily');
    });

  it('prSqlBuilder:Dataset creates a statement with an object filter with an != operator',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        dimensions: [
          {name: 'osFamily'}
        ],
        where: {
          site: 0,
          country: {
            val: 'usa',
            operator: '!='
          }
        }
      });
      expect(query).toEqual('select osFamily from pulsar_session where site = 0 and country != \'usa\' group by osFamily');
    });

  it('prSqlBuilder:Dataset creates a statement with a simple order by',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        metrics: [
          {name: 'pageViews', type: 'max', alias: 'pageViews'}
        ],
        dimensions: [
          {name: 'osFamily'}
        ],
        orderBy: 'pageViews'
      });
      expect(query).toEqual('select max(pageViews) as "pageViews", osFamily from pulsar_session group by osFamily order by pageViews desc');
    });

  it('prSqlBuilder:Dataset creates a statement with an order by object',
    function() {
      var query = prSqlBuilder.buildQuery({
        table: 'pulsar_session',
        metrics: [
          {name: 'pageViews', type: 'max', alias: 'pageViews'}
        ],
        dimensions: [
          {name: 'osFamily'}
        ],
        orderBy: {
          pageViews: 'asc'
        }
      });
      expect(query).toEqual('select max(pageViews) as "pageViews", osFamily from pulsar_session group by osFamily order by pageViews asc');
    });

  it('prSqlBuilder:Dataset creates a statement with an object filter with an "in" operator', function() {
    var query = prSqlBuilder.buildQuery({
      table: 'pulsar_session',
      dimensions: [
        {name: 'osFamily'}
      ],
      where: {
        site: 0,
        country: {
          val: ['usa', 'gb'],
          operator: 'in'
        }
      }
    });
    expect(query).toEqual('select osFamily from pulsar_session where site = 0 and country in (\'usa\', \'gb\') group by osFamily');
  });
});

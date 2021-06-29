todos:

* view entity
* embeds
* checks, indices, uniques in entity schema
* finish `where` typing
* tree entities
* entity inheritance
* cascades???
* lazy load methods into repository / manager
* extend data source manager / repository with plugins
* unit of work (as separate feature, not a core feature)
* store unit of work operations in external storage (such as redis)


----

TypeORM will be divided into multiple packages:

* core - contains core interfaces and functionality
  * cache - interfaces for caching
  * data-source - interfaces for data source creation
  * connection
  * manager
  * entity schema
  * find options
  * sql-query builder
  * entity metadata
  * utils - set of utility types
  * logger
  * repository
  * naming strategy
  * listeners and subscribers
* rdbms - contains common functionality for all rdbms-databases
  * persistence
  * schema build process
  * common table schema types
* cli - command line tools
* cache-redis - query caching into redis
* cache-rdbms - caching into table in rdbms
* decorators - if TypeORM is going to be used with decorators, but decorators are db-specific...
* query-builder - legacy query builder
* logger-debug
* logger-simple-console
* logger-console
* migrations - migrations framework
* subscribers -> will be deprecated, suppressed by observers

supported drivers:

* aurora-data-api
* aurora-data-api-pg
* better-sqlite3
* cockroachdb
* cordova
* expo
* mongodb
* mysql
* nativescript
* oracle
* postgres
* react-native
* sap
* sqlite
* sqlite-abstract
* sqljs
* sqlserver

every driver contains:

* find options declaration
* operators

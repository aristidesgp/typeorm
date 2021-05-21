export type DataSourceColumnTypes = {
  [databaseTypeName: string]: DataSourceColumnTypeOptions<any>
}
export type DataSourceColumnTypeOptions<Type> = {
  type: Type
}

export type OrderValueTypes = "asc" | "desc"

export type DataSourceTypes = {
  columnTypes: any // DataSourceColumnTypes
  orderTypes: any // OrderValueTypes
  findOptions: {}
  insertResult: any
  updateResult: any
  deleteResult: any
  queryResult: any
  insertOptions: {}
  updateOptions: {}
  updateByOptions: {}
  deleteOptions: {}
  deleteByOptions: {}
  archiveOptions: {}
  archiveByOptions: {}
  unarchiveOptions: {}
  unarchiveByOptions: {}
}

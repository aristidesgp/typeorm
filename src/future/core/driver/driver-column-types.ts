export type DriverColumnTypes = {
  [databaseTypeName: string]: DriverColumnTypeOptions<any>
}
export type DriverColumnTypeOptions<Type> = {
  type: Type
}

export type OrderValueTypes = "asc" | "desc"

export type DriverTypes = {
  columnTypes: any // DriverColumnTypes
  orderTypes: any // OrderValueTypes
  lockTypes: any // DriverLockTypes
  insertResult: any
  updateResult: any
  deleteResult: any
  queryResult: any
  isolationLevels: any
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

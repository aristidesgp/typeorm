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
}

export type DriverColumnTypes = {
  [databaseTypeName: string]: DriverColumnTypeOptions<any>
}
export type DriverColumnTypeOptions<Type> = {
  type: Type
}

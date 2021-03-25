
export type ForceEmptyType<T> = T extends undefined ? {} : T
export type ValueOf<T> = T[keyof T];

export type UnionKeys<T> = T extends unknown ? keyof T : never

export type NonEmptyArray<T> = [T, ...T[]]

export type UnpackPromise<Type> = Type extends Promise<infer R> ? R : Type

import { isDate as dateFnsIsDate } from 'date-fns'

export interface ValidationOptions {
  stop?: boolean
}

export type Validator<T> = (val: any, opts?: ValidationOptions) => val is T

export const validateOrThrow =
  <T>(validator: Validator<T>, message: string) =>
  (val: any, { stop = false } = {}): val is T => {
    const result = validator(val)
    if (stop && !result) throw new Error(`${message} instead of ${typeof val}`)
    return result
  }

export const isNumber = validateOrThrow(
  (val: any): val is number => typeof val === 'number',
  `val should be a number`
)
export const isString = validateOrThrow(
  (val: any): val is string => typeof val === 'string',
  `val should be a string`
)
export const isUnkown = validateOrThrow(
  (val: any): val is unknown => true,
  `val should be unknown`
)
export const isNull = validateOrThrow(
  (val: any): val is null => val === null,
  `val should be null`
)
export const isObject = validateOrThrow(
  (val: any): val is {} => typeof val === 'object' && val !== null,
  'val should be an object'
)
export const isError = validateOrThrow(
  (val: any): val is Error => val instanceof Error,
  'val should be an error'
)
export const isDate = validateOrThrow(
  (val: any): val is Date => dateFnsIsDate(val),
  'val should be a date object'
)

const _hasKey = <Key, Datatype>(
  key: Key,
  validator: Validator<Datatype>,
  obj: any,
  opts: ValidationOptions
) => obj.hasOwnProperty(key) && validator(obj[key], opts)
const _hasKeyStopped = <Key, Datatype>(
  key: Key,
  validator: Validator<Datatype>,
  obj: any,
  opts: ValidationOptions
) => {
  try {
    const result = _hasKey(key, validator, obj, opts)
    if (!result) throw new Error(`expected to have property ${key}`)
    return result
  } catch (e) {
    throw new Error(`${key} - ${e.message}`)
  }
}

export const hasKey =
  <Key extends string, Datatype>(
    key: Key,
    validator: Validator<Datatype>
  ): Validator<Record<Key, Datatype>> =>
  (obj: Record<string, any>, opts = {}): obj is Record<Key, Datatype> =>
    opts.stop
      ? _hasKeyStopped(key, validator, obj, opts)
      : _hasKey(key, validator, obj, opts)

export const isArray =
  <Datatype>(validator: Validator<Datatype>) =>
  (val: any, opts = {}): val is Datatype[] =>
    Array.isArray(val) &&
    val.reduce((memo, val) => memo && validator(val, opts), true)

export const and =
  <A, B>(valA: Validator<A>, valB: Validator<B>): Validator<A & B> =>
  (val: any, opts = {}): val is A & B =>
    valA(val, opts) && valB(val, opts)

const _or = <A, B>(
  valA: Validator<A>,
  valB: Validator<B>,
  val: any,
  opts: ValidationOptions
) => valA(val, opts) || valB(val, opts)
const _orStopped = <A, B>(
  valA: Validator<A>,
  valB: Validator<B>,
  val: any,
  opts: ValidationOptions
) => {
  let errorA: any
  let errorB: any
  let resA = false
  let resB = false
  try {
    resA = valA(val, opts)
  } catch (e) {
    errorA = e
  }
  try {
    resB = valB(val, opts)
  } catch (e) {
    errorB = e
  }
  const res = resA || resB
  if (!res) {
    throw new Error(`${errorA} || ${errorB}`)
  }
  return res
}
export const or =
  <A, B>(valA: Validator<A>, valB: Validator<B>): Validator<A | B> =>
  (val: any, opts = {}): val is A | B =>
    opts.stop ? _orStopped(valA, valB, val, opts) : _or(valA, valB, val, opts)

export function all<A>(a: Validator<A>): Validator<A>
export function all<A, B>(a: Validator<A>, b: Validator<B>): Validator<A & B>
export function all(...validators: Validator<any>[]) {
  return (val: any, opts = {}) =>
    validators.reduce((memo, validator) => memo && validator(val, opts), true)
}

export const isNumberOrNull = or(isNumber, isNull)
export const isStringOrNull = or(isString, isNull)

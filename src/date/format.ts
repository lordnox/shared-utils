import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export let locale = de

export const setLocale = (newLocal: Locale) => {
  locale = newLocal
}

export const getLocale = () => locale

export const f: (
  ...parms: Parameters<typeof format>
) => ReturnType<typeof format> = (date, formatStr, options) =>
  format(date, formatStr, {
    locale,
    ...options,
  })

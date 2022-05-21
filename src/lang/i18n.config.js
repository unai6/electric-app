
const numberFormats = {
  es: {
    decimals: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    currency: {
      style: 'currency',
      currency: 'EUR',
    },
  },
}

const commonDatetimeFormats = {
  time: {
    hour: 'numeric', minute: 'numeric',
  },
  compact: {
    weekday: 'long', day: 'numeric',
  },
  compactMonth: {
    month: 'short', weekday: 'short', day: 'numeric',
  },
  short: {
    year: 'numeric', month: 'short', day: 'numeric',
  },
  long: {
    year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false,
  },
  longDayMonthHour: {
    month: 'long', weekday: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false,
  },
  daymonth: {
    month: 'long', day: 'numeric',
  },
  weekday: {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  },
  shortMonthOnly: {
    month: 'short',
  },
  weekdayOnly: {
    weekday: 'long',
  },
}

const datetimeFormats = {
  es: commonDatetimeFormats,
}

export default {
  legacy: false, // set 'false' to use Composition API
  globalInjection: true,
  useScope: 'global',
  locale: 'es',
  availableLocales: ['es'],
  fallbackLocale: 'es',
  numberFormats,
  datetimeFormats,
  silentTranslationWarn: true,
}

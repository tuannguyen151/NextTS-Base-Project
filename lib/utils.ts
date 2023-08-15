/**
 * Convert a given string to camel case by removing underscores and hyphens and capitalizing the next letter.
 *
 * @param {string} str - The string to be converted to camel case.
 * @returns {string} The converted camel case string.
 */
export const convertToCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}

/**
 * Recursively convert all keys in a given object to camel case by removing underscores and hyphens and capitalizing the next letter.
 *
 * @param {any} object - The object to be converted.
 * @returns {any} The converted object with all keys in camel case.
 */
export const convertObjectKeysToCamelCase = (object: any): any => {
  if (object === null || typeof object !== 'object') {
    return object
  }

  if (Array.isArray(object)) {
    return object.map((item) => convertObjectKeysToCamelCase(item))
  }

  return Object.keys(object).reduce((newObject: any, key: string) => {
    const newKey = convertToCamelCase(key)

    if (Array.isArray(object[key])) {
      newObject[newKey] = object[key].map((item: any) =>
        convertObjectKeysToCamelCase(item)
      )
    } else if (object[key] !== null && typeof object[key] === 'object') {
      newObject[newKey] = convertObjectKeysToCamelCase(object[key])
    } else {
      newObject[newKey] = object[key]
    }

    return newObject
  }, {})
}

/**
 * Extracts values starting with ':' and ending with '/' from a URL string.
 * @param url The URL string to extract values from. (e.g., 'https://domain.com/resource1/:xxx/resource2/:yyy')
 * @returns An array of extracted values. (e.g., ['xxx', 'yyy'])
 */
const extractValuesFromUrl = (url: string): string[] => {
  if (url.at(-1) !== '/') url += '/'

  return [...url.matchAll(/\/:([^/]+)\//g)].map((match) => match[1])
}

/**
 * Replaces values in the URL path with the corresponding values from the provided urlKeyValueOptions object.
 * @param apiUrl The original URL string containing placeholder values (e.g., 'https://domain.com/addresses/:addressId/:userId').
 * @param urlKeyValueOptions An object containing key-value pairs where the keys match the placeholders in the apiUrl (e.g., { addressId: 99, userId: 123 }).
 * @returns The updated URL string with the placeholder values replaced by the values from the urlKeyValueOptions object.
 * @throws Error if the apiUrl contains placeholders that are missing in the urlKeyValueOptions object.
 */
export const replaceValuesInUrl = (
  apiUrl: string,
  urlKeyValueOptions: { [urlKey: string]: string | number } = {}
): string => {
  if (!apiUrl.includes(':')) {
    return apiUrl
  }

  const listKeysInUrl = extractValuesFromUrl(apiUrl)
  const listKeysInPathOptions = Object.keys(urlKeyValueOptions)
  const missingKeys: string[] = []

  listKeysInUrl.forEach((urlKey) => {
    if (!listKeysInPathOptions.includes(urlKey)) {
      missingKeys.push(urlKey)
    }
  })

  if (missingKeys.length > 0) {
    const errorMessage = `Missing URL keys in urlKeyValueOptions: ${missingKeys.join(
      ', '
    )}`

    // eslint-disable-next-line no-console
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  return Object.keys(urlKeyValueOptions).reduce((url, key) => {
    if (urlKeyValueOptions[key]) {
      return url.replace(`:${key}`, urlKeyValueOptions[key].toString())
    }
    return url
  }, apiUrl)
}

/**
 * Formats the given UTC timestamp to a localized string representation.
 * @param utcTimestamp - The UTC timestamp in ISO 8601 format.
 * @param option - Optional parameter to specify formatting options.
 * @returns The formatted timestamp string in the specified language and format.
 */
export function formatTimeUTCStringToLocaleString(
  utcTimestamp: string | Date,
  option?: { isDateOnly?: boolean; lang: string }
): string {
  const date = new Date(utcTimestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const isVietnamese = option?.lang === 'vi'
  const isDateOnly = option?.isDateOnly

  if (isVietnamese) {
    if (isDateOnly) {
      return `${day}/${month}/${year}`
    } else {
      return `${day}/${month}/${year} ${hours}:${minutes}`
    }
  } else {
    if (isDateOnly) {
      return `${year}/${month}/${day}`
    } else {
      return `${year}/${month}/${day} ${hours}:${minutes}`
    }
  }
}

/**
 * Convert text to a slug.
 * @param {string} text - The text to convert.
 * @returns {string} The slug.
 */
export function convertTextToSlug(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9-]/g, '')

  return slug
}

/**
 * Remove HTML tags from a text.
 * @param {string} text - The text containing HTML tags.
 * @returns {string} The text without HTML tags.
 */
export function removeHTMLTags(text: string): string {
  const regex = /<[^>]+>/g
  return text.replace(regex, '')
}

/**
 * Extracts headings from HTML text and adds slug IDs to the headings.
 * @param {string} htmlText - The HTML text containing headings.
 * @returns {object} An object containing the modified HTML text and an array of extracted headings.
 *                   - modifiedHTML: The HTML text with added slug IDs to the headings.
 *                   - headings: An array of extracted headings.
 */
export function extractHeadingsFromHTMLText(htmlText: string): {
  modifiedHTML: string
  headings: string[]
} {
  const headings: string[] = []

  const modifiedHTML = htmlText.replace(
    /<h2>(.*?)<\/h2>/g,
    (_match, headingContent) => {
      headingContent = removeHTMLTags(headingContent)

      headings.push(headingContent)
      const slug = convertTextToSlug(headingContent)

      return `<h2 id="${slug}">${headingContent}</h2>`
    }
  )

  return { modifiedHTML, headings }
}

/**
 * Compare two values for equality.
 *
 * @param valueFirst - The first value to compare.
 * @param valueSecond - The second value to compare.
 * @returns Returns true if the values are equal, otherwise false.
 */
export function isEqual(valueFirst: unknown, valueSecond: unknown): boolean {
  if (
    typeof valueFirst !== 'object' ||
    typeof valueSecond !== 'object' ||
    valueFirst === null ||
    valueSecond === null
  ) {
    return valueFirst === valueSecond
  }

  const obj1 = valueFirst as Record<string, unknown>
  const obj2 = valueSecond as Record<string, unknown>

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    const val1 = obj1[key]
    const val2 = obj2[key]

    if (!isEqual(val1, val2)) {
      return false
    }
  }

  return true
}

/**
 * Get the keys and values with changed values between the `changedObj` and the `originalObj`.
 *
 * @param changedObj - The object with changed values.
 * @param originalObj - The original object to compare against.
 * @returns An object containing the keys and values with changed values.
 */
export function getChangedKeysAndValues<T extends object>(
  changedObj: T,
  originalObj: T
): T {
  const changedKeysAndValues: Partial<T> = {}

  ;(Object.keys(changedObj) as Array<keyof T>).forEach((key) => {
    const hasChanged = !isEqual(originalObj[key], changedObj[key])

    if (hasChanged) {
      ;(changedKeysAndValues as Partial<T>)[key] = changedObj[key]
    }
  })

  return changedKeysAndValues as T
}

/**
 * Calculates the age based on the birthday, including years, months, and days.
 * @param birthday - The birthday date in either string (UTC timestamp in ISO 8601 format) or Date format.
 * @returns An object representing the age with `years`, `months`, and `days` properties.
 */
export function calculateAge(birthday: string | Date): {
  years: number
  months: number
  days: number
} {
  const birthdayDate = new Date(birthday)
  const currentDate = new Date()

  const yearDiff = currentDate.getFullYear() - birthdayDate.getFullYear()
  const monthDiff = currentDate.getMonth() - birthdayDate.getMonth()
  const dayDiff = currentDate.getDate() - birthdayDate.getDate()

  let ageYears = yearDiff
  let ageMonths = monthDiff
  let ageDays = dayDiff

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    ageYears--
    ageMonths += 12
  }

  if (dayDiff < 0) {
    const daysInLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate()
    ageMonths--
    ageDays = dayDiff + daysInLastMonth
  }

  return { years: ageYears, months: ageMonths, days: ageDays }
}

function getAgeString(
  age: { years: number; months: number; days: number },
  yearUnit: string,
  monthUnit: string,
  dayUnit: string,
  separator: string
): string {
  const parts = []

  if (age.years !== 0) parts.push(`${age.years} ${yearUnit}`)
  if (age.months !== 0) parts.push(`${age.months} ${monthUnit}`)
  if (age.years === 0 && age.months <= 2 && age.days !== 0)
    parts.push(`${age.days} ${dayUnit}`)

  return parts.join(separator)
}
/**
 * Generates a string representation of a pet's age based on the provided birthday and language.
 *
 * @param birthday - The birthday of the pet. It can be either a string or a Date object.
 * @param lang - The language in which to generate the age string. It can be either 'vi' for Vietnamese or 'en' for English.
 * @returns The string representation of the pet's age in the specified language.
 */
export function petAgeString(birthday: string | Date, lang: string): string {
  const age = calculateAge(birthday)

  if (lang === 'vi') return getAgeString(age, 'năm', 'tháng', 'ngày', ' ')

  return getAgeString(age, 'years', 'months', 'days', ' ')
}

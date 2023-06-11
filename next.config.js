/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin')

module.exports = nextTranslate({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi'
  }
})

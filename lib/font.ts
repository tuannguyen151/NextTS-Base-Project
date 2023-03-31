import { NextFontWithVariable } from 'next/dist/compiled/@next/font'
import { Noto_Sans } from 'next/font/google'

export const fontBase: NextFontWithVariable = Noto_Sans({
  subsets: ['vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-base'
})

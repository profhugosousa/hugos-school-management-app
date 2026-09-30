import { useTranslation } from 'react-i18next'

const numberToWords = (n) => {
    const ones = [
        'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
        'seventeen', 'eighteen', 'nineteen'
    ]
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

    if (n === 1000) return 'one thousand'
    if (n < 20) return ones[n]

    if (n < 100) {
        const t = Math.floor(n / 10)
        const r = n % 10
        return tens[t] + (r ? '-' + ones[r] : '')
    }

    const h = Math.floor(n / 100)
    const r = n % 100
    return ones[h] + ' hundred' + (r ? ' ' + numberToWords(r) : '')
}

const ordinalNumberToWords = (n) => {
    const ones = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth']
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
    const tensOrdinal = ['', '', 'twentieth', 'thirtieth', 'fortieth', 'fiftieth', 'sixtieth', 'seventieth', 'eightieth', 'ninetieth']

    if (n < 20) return ones[n]
    const t = Math.floor(n / 10)
    const r = n % 10
    return r === 0 ? tensOrdinal[t] : `${tens[t]}-${ones[r]}`
}

const getOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]
}

export const formatLessonNumber = (lessonNumber, t, lang = 'pt') => {
    if (!lessonNumber) return ''
    const str = String(lessonNumber).trim()
    const doubleMatch = str.match(/^(\d+)\s*(?:e|&|-|,|and)\s*(\d+)$/i)

    if (doubleMatch) {
        const firstNum = parseInt(doubleMatch[1], 10)
        const secondNum = parseInt(doubleMatch[2], 10)

        if (lang === 'pt') {
            return t('lesson_double', { first: doubleMatch[1], second: doubleMatch[2], defaultValue: `Lições n.º ${doubleMatch[1]} e ${doubleMatch[2]}` })
        }

        const firstWord = numberToWords(firstNum)
        const secondWord = numberToWords(secondNum)
        return t('lesson_double', {
            first: `${doubleMatch[1]} (${firstWord})`,
            second: `${doubleMatch[2]} (${secondWord})`,
            defaultValue: `Lessons no. ${doubleMatch[1]} (${firstWord}) and ${doubleMatch[2]} (${secondWord})`
        })
    }

    const match = str.match(/\d+/)
    const num = match ? parseInt(match[0], 10) : null

    if (lang === 'pt' || !num) {
        return `${t('lesson_single', { defaultValue: 'Lição n.º' })} ${str}`
    }

    const word = numberToWords(num)
    return `${t('lesson_single', { defaultValue: 'Lesson no.' })} ${str} (${word})`
}

export const formatDate = (dateString, lang = 'pt') => {
    if (!dateString) return ''
    const date = new Date(dateString)

    if (lang === 'pt') {
        return date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    } else {
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
        const day = date.getDate()
        const month = date.toLocaleDateString('en-US', { month: 'long' })
        const year = date.getFullYear()

        return `${dayOfWeek}, ${day}${getOrdinal(day)} (${ordinalNumberToWords(day)}) of ${month} ${year}`
    }
}

export const useFormatters = () => {
    const { t, i18n } = useTranslation()
    const lang = i18n?.language || 'pt'

    return {
        formatLessonNumber: (lessonNumber) => formatLessonNumber(lessonNumber, t, lang),
        formatDate: (dateString) => formatDate(dateString, lang),
        t,
        lang
    }
}
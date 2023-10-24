import { format, parse } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import {
    Complement,
    ConnectedDataURL,
    DataTooltip,
    DomainValues,
    TypeChart,
    WidthProps
} from '../core/types'

export const DOWNLOAD_ICON =
    'path://M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 ' +
    '.67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z'

export const DATA_VIEW_ICON =
    'path://M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 ' +
    '3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z'

export const ICON_STYLE = {
    color: '#152849',
    borderColor: '#152849',
    borderWidth: 0.1
}

export const takeLabelComplement = (
    item: number,
    yComplement: Complement,
    typeChart?: TypeChart
) => {
    const getComplement = (complement?: string) =>
        complement ? formatValueAxis(item, complement, typeChart) : item

    return typeof yComplement === 'function'
        ? yComplement(item)
        : getComplement(yComplement)
}

export const takeDonutChartComplement = (
    item: number,
    complement?: Complement
) =>
    item === 0 && typeof complement === 'function'
        ? ''
        : `${item}  ${complement ? `(${complement})` : ''}`

export const timeConvert = (value: number) => {
    const hrs = Math.floor(value)
    const min = Math.round((value - hrs) * 60)

    const hours = hrs.toString().length > 1 ? hrs : `0${hrs}`
    const minutes = min.toString().length > 1 ? min : `0${min}`

    return `${hours}:${minutes}`
}

export const getPercentage = (value: number, valueTotal: number) =>
    value !== 0 ? (value * (100 / valueTotal)).toFixed(2) : '0'

export const generateAuxMessage = (
    label: string,
    result: number,
    complement: Complement
) => {
    const value = typeof complement === 'function' ? complement(result) : result

    return `<span style="margin-left: 15.2px;"></span>${label}: ${value}<br>`
}

export const monuntTimeMessage = (item: DataTooltip, stackedValues: number) => {
    const time = timeConvert(Number(item.value))
    const percent =
        item.value !== 0
            ? getPercentage(Number(item.value), stackedValues)
            : '0'

    return item.seriesName + ': ' + time + ' (' + percent + '%) <br>'
}

// These 3 next functions are used on the mountMessage function.
const formatValueAxis = (
    value: number,
    complement: Complement,
    typeChart?: TypeChart
) => {
    const isMoney =
        typeof complement === 'function'
            ? complement(value)
            : value + complement

    const getTime = complement === 'time' ? timeConvert(value) : isMoney
    const formatValueIfComplementPercent =
        typeChart == 'pie'
            ? value.toFixed(2).replace('.', ',')
            : (value.toFixed(2) + '%').replace('.', ',')

    return complement === '%' || complement === 'percent'
        ? formatValueIfComplementPercent
        : getTime
}

const takeComplement = (data: string | number, complement: Complement) =>
    typeof complement === 'function'
        ? ': ' + complement(data) + '<br>'
        : ': ' + data + complement + '<br>'

const moneyWithPercentage = (
    moneyValue: number | { value: number | string } | string,
    moneyValueTotal: number,
    complement: (value: string | number) => string,
    sumDataValues?: boolean
) => {
    const value = typeof moneyValue === 'object' ? moneyValue.value : moneyValue

    const percent = getPercentage(Number(value), moneyValueTotal)

    return sumDataValues
        ? complement(value) + ' (' + percent + '%) <br>'
        : complement(value) + '<br>'
}

// Specific function only used in the stacked bar chart tooltip
export const mountMessage = (
    value: DataTooltip,
    complement: Complement,
    axisType: string,
    stackedValues: number,
    sumDataValues: boolean
) => {
    const seriesLabel = value.marker + value.seriesName

    const moneyValue =
        typeof complement === 'function'
            ? moneyWithPercentage(
                  value.data,
                  stackedValues,
                  complement,
                  sumDataValues
              )
            : ''

    const isPercentage =
        axisType === 'percent' || complement === '%'
            ? seriesLabel +
              ': ' +
              (formatValueAxis(Number(value.data), '%') + '<br>')
            : seriesLabel + takeComplement(value.data, complement)

    return typeof complement === 'function' && value.seriesType !== 'line'
        ? seriesLabel + ': ' + moneyValue
        : isPercentage
}

export const toDate = (text: string, format?: string) =>
    parse(text, format ? format : 'yyyy-MM-dd', new Date())

export const formatTime = (text: string, dateFormat = 'dd MMM') =>
    format(new Date(text), dateFormat, { locale: ptBR })

export const formatTooltip = (text: string, dateFormat = 'dd MMM') =>
    format(new Date(text), getDateFormatType(dateFormat, 'dd/MM/yyyy'), {
        locale: ptBR
    })

export const formatTooltipWithHours = (text: string) =>
    format(new Date(text), 'dd/MM/yyyy HH:mm', { locale: ptBR })

export const truncateLabel = (text: string, labelWordSize?: number) => {
    const numberOfLetters = labelWordSize ? labelWordSize : 12
    const lettersToShow = labelWordSize ? 3 : 4

    return text.length > numberOfLetters
        ? text.slice(0, numberOfLetters - lettersToShow) + '...'
        : text
}

export const fixedTruncateLabel = (text: string, size: number) =>
    text.length > size ? text.slice(0, size - 3) + '...' : text

// This is a xgh that needs improvments, it's used to take the domain
// of the line and area charts, there is the range of the y axis that
// is printed on component.
export const getDomain = (item: DomainValues) => {
    switch (true) {
        case item.max >= 2500:
            return item.max + (item.max * 20) / 100
        case item.max >= 2000:
            return item.max + (400 - (item.max % 400))
        case item.max >= 1500:
            return item.max + (300 - (item.max % 300))
        case item.max >= 1000:
            return item.max + (200 - (item.max % 200))
        case item.max >= 400:
            return item.max + (100 - (item.max % 100))
        case item.max >= 95:
            return item.max + (60 - (item.max % 60))
        case item.max >= 60:
            return item.max + (50 - (item.max % 50))
        case item.max >= 50:
            return item.max + (40 - (item.max % 40))
        case item.max >= 40:
            return item.max + (30 - (item.max % 30))
        case item.max >= 30:
            return item.max + (20 - (item.max % 20))
        case item.max >= 20:
            return item.max + (10 - (item.max % 10))
        case item.max >= 2:
            return item.max + (5 - (item.max % 5))
        default:
            return item.max + (3 - (item.max % 3))
    }
}

export const fixedDomain = (item: DomainValues) =>
    item.max >= 90 ? 100 : getDomain(item)

export const getSaveAsImage = (title: string) => ({
    title,
    type: 'jpeg',
    show: true,
    icon: DOWNLOAD_ICON,
    iconStyle: ICON_STYLE,
    excludeComponents: ['toolbox', 'dataZoom']
})

export const getDataView = (title: string) => ({
    title,
    show: true,
    icon: DATA_VIEW_ICON,
    iconStyle: ICON_STYLE,
    buttonColor: '#152849',
    // TODO: pass this labels as a props from the component use.
    lang: [title, 'Voltar', 'Atualizar']
})

// This function get the initial values, the range of the initial
// scroll, that are used at scrollable charts with dates.
// 30 values for monthly charts, 12 for yearly charts.
export const getInitialValues = (
    arrayLength: number,
    dateFormat?: string,
    scrollStart?: number
) => {
    if (scrollStart) {
        return arrayLength > scrollStart
            ? 100 - (scrollStart * 100) / arrayLength
            : 0
    }

    const monthly = arrayLength > 30 ? 100 - 3000 / arrayLength : 0
    const yearly = arrayLength > 12 ? 100 - 1200 / arrayLength : 0

    return dateFormat !== 'yyyy-MM' ? monthly : yearly
}

// This function take a number and put on this the thousand separator ".", e.g.:
// 1000 => 1.000
// 1000000 => 1.000.000
export const thousandSeparator = (values: string | number) =>
    values.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

// This function is used to print the title on chart image download even
// the chart's title is not rendered on the component.
export const getSaveAsImageWithTitle = (
    title: string,
    setTitle: (show: boolean) => void
) => ({
    title,
    show: true,
    icon: DOWNLOAD_ICON,
    iconStyle: ICON_STYLE,
    onclick: (
        item: { option: { title: { text: string }[] } },
        chartInfo: { getConnectedDataURL: (opts: ConnectedDataURL) => string }
    ) => {
        const title =
            item.option.title.length > 0 ? item.option.title[0].text : 'image'

        setTitle(true)

        const url = chartInfo.getConnectedDataURL({
            type: 'jpg',
            backgroundColor: '#fff',
            connectedBackgroundColor: '#fff',
            excludeComponents: ['toolbox', 'dataZoom']
        })

        const a = document.createElement('a')
        a.download = title + '.jpeg'
        a.target = '_blank'
        a.href = url

        const event = new MouseEvent('click', {
            view: document.defaultView,
            bubbles: true,
            cancelable: false
        })

        a.dispatchEvent(event)

        setTitle(false)
    }
})

export const getWidthOpts = (width: WidthProps) => ({ width })

export const convertImageToBase64FromUrl = (imgUrl: string) => {
    return new Promise(resolve => {
        const img = new Image()
        img.src = imgUrl
        img.setAttribute('crossOrigin', 'anonymous')

        img.onload = function () {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = 40
            canvas.height = 40

            ctx.save()
            ctx.beginPath()
            ctx.arc(40 / 2, 40 / 2, 40 / 2, 0, Math.PI * 2)
            ctx.clip()
            ctx.drawImage(img, 0, 0, 40, 40)
            ctx.restore()

            const dataUrl = ctx.canvas.toDataURL('image/png')
            resolve(dataUrl)
        }
    })
}

export const changeSpaceForUnderline = (value: string) =>
    value.replace(' ', '_')

export const formatLabelWithImage = (text: string) => {
    const textFormatted =
        '{value|' + text + '} {' + changeSpaceForUnderline(text) + '| }'

    return textFormatted
}

export const getDateFormatType = (dateFormat: string, baseFormat?: string) => {
    if (dateFormat === 'yyyy-MM') {
        return baseFormat ? baseFormat : 'MMM/yy'
    }

    return dateFormat
}

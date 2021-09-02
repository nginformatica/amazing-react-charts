import { format, parse } from 'date-fns'
import { takeLast } from 'ramda'
import ptBR from 'date-fns/locale/pt-BR'
import { TDataTooltip, TDomainValues } from './types'

type TConnectedDataURL = {
  type?: string
  backgroundColor?: string
  connectedBackgroundColor?: string
  excludeComponents?: string[]
}

const DOWNLOAD_ICON =
  'path://M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 ' +
  '.67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z'

const iconStyle = {
  color: '#152849',
  borderColor: '#152849',
  borderWidth: 0.1
}

export const takeLabelComplement = (
  item: number,
  complement: string,
  formatterMoney?: (value: string | number) => string
) => {
  const getComplement = complement
    ? formatValueAxis(item, complement)
    : item

  return complement === 'money' && formatterMoney
    ? formatterMoney(item)
    : getComplement
}

export const takeDonutComplement = (item: number, complement?: string) =>
  item === 0 ? '' : item + (complement || '')

export const timeConvert = (value: number) => {
  const seconds = Math.round((value % 1) * 3600)
  const minutes = Math.trunc(seconds / 60)
  const formatedMinutes = takeLast(2, '0' + minutes)

  return minutes > 0
    ? Math.floor(value) + ':' + formatedMinutes
    : Math.floor(value) + ':00'
}

export const formatValueAxis = (value: number, complement: string) => {
  const getTime = complement === 'time'
    ? timeConvert(value)
    : value + complement

  return complement === '%' || complement === 'percent'
    ? (value.toFixed(2) + '%').replace('.', ',')
    : getTime
}

export const takeComplement = (
  data: string | number,
  complement: string,
  formatterMoney: (value: string | number) => string
) =>
  complement === 'money'
    ? ': ' + formatterMoney(data) + '<br>'
    : ': ' + data + complement + '<br>'

export const getPercentage = (value: number, valueTotal: number) =>
  value !== 0 ? (value * (100 / valueTotal)).toFixed(2) : '0'

export const moneyPercent = (
  value: number,
  valueTotal: number,
  formatterMoney: (value: string | number) => string,
  sumDataValues?: boolean
) => {
  const percent = getPercentage(value, valueTotal)

  return sumDataValues
    ? formatterMoney(value) + ' (' + percent + '%) <br>'
    : formatterMoney(value) + '<br>'
}

export const generateAuxMessage = (
  label: string,
  result: number,
  complement: string,
  formatterMoney?: (value: string | number) => string
) => {
  const value = complement === 'money' && formatterMoney 
    ? formatterMoney(result) 
    : result

  return `<span style="margin-left: 15.2px;"></span>${label}: ${value}<br>`
}

export const monuntTimeMessage = (
  item: TDataTooltip,
  stackedValues: number
) => {
  const time = timeConvert(Number(item.value))
  const percent = item.value !== 0
    ? getPercentage((Number(item.value)), stackedValues)
    : '0'

  return item.seriesName + ': ' + time + ' (' + percent + '%) <br>'
}

export const mountMessage = (
  value: TDataTooltip,
  complement: string,
  axisType: string,
  stackedValues: number,
  sumDataValues: boolean,
  formatterMoney?: (value: string | number) => string
) => {
  const seriesLabel = value.marker + value.seriesName

  const moneyValue =
    moneyPercent(
      Number(value.data),
      stackedValues,
      formatterMoney,
      sumDataValues
    )

  const isPercentage = axisType === 'percent' || complement === '%'
    ? seriesLabel + ': ' + (
      formatValueAxis(Number(value.data), '%') + '<br>'
    )
    : seriesLabel + takeComplement(value.data, complement, formatterMoney)

  return complement === 'money' && value.seriesType !== 'line'
    ? seriesLabel + ': ' + moneyValue
    : isPercentage
}

export const toDate = (text: string, format?: string) =>
  parse(text, format ? format : 'yyyy-MM-dd', new Date())

export const formatTime = (text: string, dateFormat: string) =>
  format(new Date(text), dateFormat, { locale: ptBR })

export const formatTooltip = (text: string, dateFormat?: string) =>
  format(new Date(text), dateFormat ? 'MMM/yy' : 'dd/MM/yyyy', {
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

export const truncateSpecialLabel = (text: string, size: number) =>
  text.length > size ? text.slice(0, size - 3) + '...' : text

export const getDomain = (item: TDomainValues) => {
  // TODO: improve this "pattern matching" xgh
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

export const fixedDomain = (item: TDomainValues) =>
  item.max >= 90 ? 100 : getDomain(item)

export const getSaveAsImage = (title: string) => ({
  title,
  type: 'jpeg',
  show: true,
  icon: DOWNLOAD_ICON,
  iconStyle,
  excludeComponents: ['toolbox', 'dataZoom']
})

export const getSaveAsImageWithTitle = (
  title: string,
  setTitle: (show: boolean) => void
) => ({
  title,
  show: true,
  icon: DOWNLOAD_ICON,
  iconStyle,
  onclick: (
    item: { option: { title: { text: string }[] } },
    chartInfo: { getConnectedDataURL: (opts: TConnectedDataURL) => string }
  ) => {
    const title = item.option.title.length > 0
      ? item.option.title[0].text
      : 'image'

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

export const getDataView = (title: string) => ({
  title,
  show: true,
  icon:
    'path://M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 ' +
    '3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z',
  iconStyle: {
    color: '#152849',
    borderColor: '#152849',
    borderWidth: 0.1
  },
  buttonColor: '#152849',
  lang: [title, 'Voltar', 'Atualizar']
})

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

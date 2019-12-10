import { formatToBRL } from 'brazilian-values'
import { format, parse } from 'date-fns'
import { takeLast } from 'ramda'
import { ptBR } from 'date-fns/locale'
import { TDataTooltip } from './types'

export const takeComplement = (data: string | number, complement: string) =>
    complement === 'money'
        ? ': ' + formatToBRL(data) + '<br>'
        : ': ' + data + complement + '<br>'

export const moneyPercent = (
    value: number,
    valueTotal: number,
    sumDataValues?: boolean
) => {
    const percent = value !== 0 ? (value * (100 / valueTotal)).toFixed(2) : 0

    return sumDataValues
        ? formatToBRL(value) + ' (' + percent + '%) <br>'
        : formatToBRL(value) + '<br>'
}

export const mountMessage = (
    value: TDataTooltip,
    complement: string,
    axisType: string,
    stackedValues: number,
    sumDataValues: boolean
) =>
    complement === 'money' && value.seriesType !== 'line'
        ? value.marker + value.seriesName + ': ' + (
            moneyPercent(value.data as number, stackedValues, sumDataValues)
        )
        : axisType === 'percent'
            ? value.marker + value.seriesName + ': ' + value.data + '% <br>'
            : value.marker + value.seriesName + (
                takeComplement(value.data, complement)
            )

export const toDate = (text: string) => parse(text, 'yyyy-MM-dd', new Date())

export const formatTime = (text: string, dateFormat: string) =>
    format(new Date(text), dateFormat, { locale: ptBR })

export const formatTooltip = (text: string) =>
    format(new Date(text), 'dd/MM/yyyy')

export const timeConvert = (value: number) => {
    const seconds = Math.round((value % 1) * 3600)
    const minutes = Math.trunc(seconds / 60)
    const formatedMinutes = takeLast(2, '0' + minutes)

    return minutes > 0
        ? Math.round(value) + ':' + formatedMinutes
        : Math.round(value) + ':00'
}

export const truncateText = (text: string, listSize?: number) => {
    const wordSize = listSize && listSize > 10 ? 8 : 12

    return text.length > wordSize ? text.slice(0, wordSize - 3) + '...' : text
}

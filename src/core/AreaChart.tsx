import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { format, parse } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { takeLast } from 'ramda'

export interface IProps {
    data: TData[]
    tooltip?: TTooltip
    color?: string
    xType?: 'time' | 'category'
    yType?: 'time' | 'value'
}

export type TTooltip = { label: string, result: string }

export type TData = { label: string, result: number }

export type TSeries = {
    name?: string
    yAxisIndex?: number
    label?: TLabelProps
    areaStyle?: React.CSSProperties
    lineStyle?: React.CSSProperties
    type: 'line' | 'bar'
    data: number[] | string[] | Date[]
}

export type TLabelProps = {
    normal?: TNormalProps
}

export type TNormalProps = {
    show: boolean,
    position?: 'top' | 'bottom' | 'left' | 'right' | [number, number]
    fontSize?: number
    color?: string
    distance?: number
}

export type TGridProps = {
    show: boolean
}

export type TAxisLabel = {
    // TODO: Type formatter correctly
    formatter?: any
    textStyle?: React.CSSProperties
    interval?: number | 'auto'
    rotate?: number
}

type TSplitLineProps = {
    show?: boolean
    lineStyle?: {
        color?: string | string[]
        width?: number
        opacity?: number
        type?: 'solid' | 'dashed' | 'dotted'
    }
}

export type TAxisProps = {
    name?: string
    type?: 'category' | 'value' | 'time'
    boundaryGap?: boolean
    data?: number[] | string[] | Date[]
    axisLabel?: TAxisLabel
    gridIndex?: number
    showGrid?: boolean
    splitLine?: TSplitLineProps
}

export interface IOptions {
    series: TSeries[]
    xAxis: TAxisProps
    yAxis: TAxisProps
    grid?: TGridProps
}

export type TTooltipProps = {
    // TODO: Type formatter correctly
    formatter: any
    trigger?: 'axis'
    textStyle?: React.CSSProperties
}


export const toDate = (text: string) => parse(text, 'yyyy-MM-dd', new Date())

export const formatLabel = (text: string) =>
    format(new Date(text), 'dd MMM', { locale: ptBR })

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

const AreaChart = (props: IProps) => {
    const { data, xType, color, tooltip: tooltipProps, yType } = props

    const yData = data.map(item => item.result)
    const xData = xType === 'time'
        ? data.map(item => toDate(item.label))
        : data.map(item => item.label)

    //TODO: Type formatSingleTootltip correctly
    const formatSingleTooltip = (chartValues: any) => {
        const { label, result } = tooltipProps
        const { axisValueLabel, data } = chartValues[0]
        const values = yType === 'time' ? timeConvert(data) + 'h' : data 

        return [
            `${label}: ${formatTooltip(axisValueLabel)} <br>` +
            `${result}: ${values} <br>`
        ]
    }

    const tooltip: TTooltipProps = {
        formatter: formatSingleTooltip,
        trigger: 'axis',
        textStyle: { fontSize: 11.5 }
    }

    const options: IOptions = {
        series: [{
            type: 'line',
            data: yData,
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    fontSize: 11.5,
                    color: 'black',
                    distance: 1.1
                }
            },
            lineStyle: {
                color: color || 'blue'
            },
            areaStyle: {
                color: color || 'blue',
                opacity: 0.2
            }
        }],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            showGrid: true,
            data: xData,
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    opacity: 0.8
                }
            },
            axisLabel: {
                formatter:
                    (item: string) => xType === 'time' ? formatLabel(item) : item,
                rotate: xData.length >= 24 ? 45 : 0,
                interval: 0,
                textStyle: {
                    fontSize: 11.5
                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    opacity: 0.8
                }
            },
            axisLabel: {
                formatter:
                    (item: number) => yType === 'time' ? timeConvert(item) + 'h' : item,
                textStyle: {
                    fontSize: 11.5
                }
            }
        },
        grid: { show: true }
    }

    return (
        <ReactEcharts
            option={
                tooltipProps
                    ? { ...options, tooltip }
                    : options
            }
        />
    )
}

export default AreaChart
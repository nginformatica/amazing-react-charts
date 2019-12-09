import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { format, parse } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { takeLast } from 'ramda'

export interface IProps {
    data: TData[]
    lineMarkValue?: number
    lineMarkColor?: string
    lineMakeName?: string
    yComplement?: string | 'money'
    tooltipComplement?: string
    tooltip?: TTooltip
    color?: string
    xType?: 'time' | 'category'
    yType?: 'time' | 'value'
}

export type TTooltip = {
    label: string,
    result?: string,
    topResult?: string,
    bottomResult?: string,
    lineResult?: string 
    complement?: string
}

export type TData = { label: string, result: number }

export type TSeries = {
    name?: string
    xAxisIndex?: number
    yAxisIndex?: number
    label?: TLabelProps
    areaStyle?: React.CSSProperties
    lineStyle?: React.CSSProperties
    barGap?: string
    barCategoryGap?: string
    animation?: boolean
    itemStyle?: TLabelProps
    barWidth?: number | string
    emphasis?: TNormalProps
    stack?: string
    silent?: boolean
    showAllSymbol?: boolean | 'auto'
    symbolSize?: number
    showSymbol?: boolean,
    hoverAnimation?: boolean,
    type: 'line' | 'bar'
    data: number[] | string[] | Date[]
}

export type TLabelProps = {
    normal?: TNormalProps
    opacity?: number
    color?: string
    formatter?: any
    show?: boolean,
    position?: 'top' | 'bottom' | 'left' | 'right' | 'rightInside' | [number, number] | any
    fontSize?: number
    fontWeight?: number
    distance?: number
    borderColor?: string
    barBorderRadius?: number
    itemStyle?: TLabelProps
}

export type TNormalProps = {
    formatter?: any
    show?: boolean,
    position?: 'top' | 'bottom' | 'left' | 'right' | 'rightInside' | [number, number] | any
    fontSize?: number
    fontWeight?: number
    color?: string
    distance?: number
    borderColor?: string
    barBorderRadius?: number
    opacity?: number
    itemStyle?: TLabelProps
}

export type TGridProps = {
    show: boolean
}

export type TAxisLabelProps = {
    // TODO: Type formatter correctly
    type?: 'value' | 'category' | 'time' | 'log'
    formatter?: any
    textStyle?: React.CSSProperties
    interval?: number | 'auto'
    rotate?: number
    show?: boolean
    inside?: boolean
    color?: string | string[]
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
    type?: 'category' | 'value' | 'time' | 'log'
    boundaryGap?: boolean
    data?: number[] | string[] | Date[]
    gridIndex?: number
    showGrid?: boolean
    splitLine?: TSplitLineProps
    axisLabel?: TAxisLabelProps
    axisTick?: TAxisTickProps
    min?: number
    max?: number
    position?: 'right' | 'left'
    axisLine?: TSplitLineProps
}

export type TAxisLineProps = {
    show?: boolean
}

export type TAxisTickProps = {
    show?: boolean
    alignWithLabel?: boolean
    interval: number
}

export interface IOptions {
    color?: string[]
    grid?: TGridProps
    legend?: TLegendProps
    series: TSeries[]
    xAxis: TAxisProps | TAxisProps[]
    yAxis: TAxisProps | TAxisProps[]
}

export type TLegendProps = {
    x?: 'center' | 'bottom',
    y?: 'center' | 'bottom',
    icon?: 'line' | 'rect'
    top?: number
    data: string[],
    itemGap?: number
}

export type TTooltipProps = {
    // TODO: Type formatter correctly
    formatter: any
    trigger?: 'axis'
    textStyle?: React.CSSProperties
}


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

export const truncateText = (text: string) =>
    text.length > 8 ? text.slice(0, 5) + '...' : text

const AreaChart = (props: IProps) => {
    const {
        data,
        xType,
        color,
        tooltip: tooltipProps,
        yType,
        lineMarkValue,
        lineMarkColor,
        lineMakeName,
        tooltipComplement,
        yComplement,
    } = props

    const markLine = lineMarkValue && data.map(() => lineMarkValue)
    const yData = data.map(item => item.result)
    const xData = xType === 'time'
        ? data.map(item => toDate(item.label))
        : data.map(item => item.label)

    const formatLabel = (chartValues: any) => {
        const { data } = chartValues

        return (yComplement
            ? data + yComplement
            : yType === 'time'
                ? timeConvert(Number(data))
                : data
        )
    }

    //TODO: Type formatSingleTootltip correctly
    const formatSingleTooltip = (chartValues: any) => {
        const { label, result } = tooltipProps
        const { axisValueLabel, data } = chartValues[0]
        const complement = tooltipComplement ? tooltipComplement : ''
        const values = yType === 'time' ? timeConvert(data) + 'h' : data

        return [
            `${label}: ${formatTooltip(axisValueLabel)} <br>` +
            `${result}: ${values} <br>` +
            complement
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
                formatter: formatLabel,
                show: true,
                position: 'top',
                fontSize: 11.5,
                color: 'black',
                distance: 1.1
            },
            lineStyle: {
                color: color || 'blue'
            },
            areaStyle: {
                color: color || 'blue',
                opacity: 0.2
            },
            itemStyle: {
                color: color
            }
        },
        {
            name: lineMakeName,
            symbolSize: 0,
            showSymbol: false,
            hoverAnimation: false,
            type: 'line',
            data: markLine,
            lineStyle: {
                color: lineMarkColor
            },
        }
        ],

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
                    (item: string) => xType === 'time'
                        ? formatTime(item, 'dd MMM')
                        : item,
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
                    (item: number) => yType === 'time'
                        ? timeConvert(item) + 'h'
                        : item + (yComplement || ''),
                textStyle: {
                    fontSize: 11.5
                }
            }
        },
        grid: { show: true },
        legend: {
            x: 'center',
            y: 'bottom',
            icon: 'line',
            top: 260,
            data: [lineMakeName],
            itemGap: 30
        }
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
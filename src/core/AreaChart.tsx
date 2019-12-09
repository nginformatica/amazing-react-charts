import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { toDate, timeConvert, formatTooltip, formatTime } from './auxiliarFunctions'

export interface IDefaultChartProps {
    data: TEntryData[]
    lineMarkValue?: number
    lineMarkColor?: string
    lineMakeName?: string
    yComplement?: string | 'money'
    tooltipComplement?: string
    tooltip?: TTooltipEntryProps
    color?: string
    xType?: 'time' | 'category'
    yType?: 'time' | 'value'
}

export type TTooltipEntryProps = {
    label: string,
    result?: string,
    topResult?: string,
    bottomResult?: string,
    lineResult?: string 
    complement?: string
}

export type TEntryData = { 
    label: string, 
    result: number 
}

export type TEntryDataTuples = 
    | [TEntryData[], TEntryData[]]
    | [TEntryData[], TEntryData[], TEntryData[]]

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

type TFormatterReturn = 
    | string[]
    | string 
    | number

type TFormatterEntry = 
    | string 
    | number 
    | TDataTooltip 
    | TDataTooltip[]

export type TFormatterType = string | ((item: TFormatterEntry) => TFormatterReturn)

export type TPositionType = 
    | 'top' 
    | 'bottom' 
    | 'left' 
    | 'right' 
    | 'insideRight'
    | 'insideLeft' 
    | [number, number]

export type TChartType = 
    | 'time'
    | 'category'
    | 'value'
    | 'log'

export type TLineStyleType =
    | 'solid' 
    | 'dashed' 
    | 'dotted'
    
export type TLabelProps = {
    normal?: TNormalProps
    opacity?: number
    color?: string
    formatter?: TFormatterType
    show?: boolean,
    position?: TPositionType
    fontSize?: number
    fontWeight?: number
    distance?: number
    borderColor?: string
    barBorderRadius?: number
    itemStyle?: TLabelProps
}

export type TNormalProps = {
    formatter?: TFormatterType
    show?: boolean,
    position?: TPositionType
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
    type?: TChartType
    formatter?: TFormatterType
    textStyle?: React.CSSProperties
    interval?: number | 'auto'
    rotate?: number
    show?: boolean
    inside?: boolean
    color?: string | string[]
    margin?: number
}

type TSplitLineProps = {
    show?: boolean
    alignWithLabel?: boolean
    lineStyle?: {
        color?: string | string[]
        width?: number
        opacity?: number
        type?: TLineStyleType
    }
}

export type TAxisProps = {
    name?: string
    type?: TChartType
    boundaryGap?: boolean
    data?: number[] | string[] | Date[]
    gridIndex?: number
    showGrid?: boolean
    splitLine?: TSplitLineProps
    axisLabel?: TAxisLabelProps
    axisTick?: TAxisTickProps
    min?: number
    max?: number
    position?: TPositionType
    axisLine?: TSplitLineProps
}

export type TAxisLineProps = {
    show?: boolean
}

export type TAxisTickProps = {
    show?: boolean
    alignWithLabel?: boolean
    interval?: number
}

export type TOptionsProps = {
    color?: string[]
    grid?: TGridProps
    legend?: TLegendProps
    series: TSeries[]
    dataZoom?: TZoomProps[] 
    xAxis: TAxisProps | TAxisProps[]
    yAxis: TAxisProps | TAxisProps[]
}

export type TZoomProps = {
        bottom?: number
        show?: boolean
        zoomLock?: boolean
        type: 'inside' | 'slider',
        endValue: number | Date | string
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
    formatter: TFormatterType
    trigger?: 'axis'
    textStyle?: React.CSSProperties
}

export type TDataTooltip = {
    name?: string
    marker?: string
    seriesName?: string
    data?: number | string
    seriesType?: string
    axisValueLabel?: string
}

const AreaChart = (props: IDefaultChartProps) => {
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
    const yData = data.map((item: TEntryData) => item.result)
    const xData = xType === 'time'
        ? data.map((item: TEntryData) => toDate(item.label))
        : data.map((item: TEntryData) => item.label)

    const formatLabel = (chartValues: TDataTooltip) => {
        const { data } = chartValues
        
        return (yComplement
            ? data + yComplement
            : yType === 'time'
                ? timeConvert(Number(data))
                : data
        )
    }

    const formatSingleTooltip = (chartValues: TDataTooltip[]) => {
        const { label, result } = tooltipProps
        const { axisValueLabel, data } = chartValues[0]
        const complement = tooltipComplement ? tooltipComplement : ''
        const values = yType === 'time' ? timeConvert(data as number) + 'h' : data

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

    const options: TOptionsProps = {
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
            }
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
                margin: yType === 'time' ? 14 : 10,
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
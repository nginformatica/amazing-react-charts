import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TDataTooltip,
    TEntryData,
    TOptionsProps,
    TTooltipProps,
    TZoomProps
} from './types'
import {
    formatTime,
    formatTooltip,
    timeConvert,
    toDate,
    truncateLabel
} from './auxiliarFunctions'

const VerticalBarChart = (props: IDefaultChartProps) => {
    const {
        data,
        color,
        xType,
        yComplement,
        yType,
        tooltip: tooltipProps,
        tooltipComplement,
        barWidth,
        dateFormat,
        grid: gridProps,
        width,
        showBarLabel
    } = props

    const yData = data.map((item: TEntryData) => item.result)
    const xData = xType === 'time'
        ? data.map((item: TEntryData) => toDate(item.label, dateFormat))
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
        const values = yType === 'time'
            ? timeConvert(data as number) + 'h'
            : data + (yComplement || '')

        const labelPrint = xType === 'time'
            ? formatTooltip(axisValueLabel)
            : axisValueLabel

        return [
            `${label}: ${labelPrint} <br>` +
            `${result}: ${values} <br>` +
            complement
        ]
    }

    const tooltip: TTooltipProps = {
        formatter: formatSingleTooltip,
        trigger: 'axis',
        textStyle: { fontSize: 11.5 }
    }

    const scrollable: TZoomProps[] = data.length > 20
        ? [
            {
                type: 'inside',
                endValue: xData.length > 20 ? xData[17] : xData[xData.length - 1]
            }, {
                bottom: 250,
                show: true,
                type: 'slider',
                endValue: xData.length > 20 ? xData[17] : xData[xData.length - 1]
            }
        ]
        : []

    const options: TOptionsProps = {
        grid: gridProps,
        color: [color],
        series: [{
            barWidth: barWidth || 'auto',
            type: 'bar',
            data: yData,
            label: {
                formatter: formatLabel,
                show: showBarLabel,
                position: 'top',
                fontSize: 11.5,
                color: 'black',
                distance: 1.1
            }
        }],
        xAxis: {
            type: 'category',
            boundaryGap: true,
            showGrid: true,
            data: xData,
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    opacity: 0.8
                },
                alignWithLabel: true
            },
            axisLabel: {
                formatter:
                    (item: string) => xType === 'time'
                        ? formatTime(item, 'dd MMM')
                        : truncateLabel(item),
                interval: 'auto',
                textStyle: {
                    fontSize: 11.5
                }
            },
            axisTick: {
                show: true,
                alignWithLabel: true
            }
        },
        yAxis: {
            max: yComplement === '%' && 100,
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
        dataZoom: scrollable
    }

    return (
        <ReactEcharts
            notMerge
            style={ { width: '99%' } }
            opts={ { width: width } }
            option={
                tooltipProps
                    ? { ...options, tooltip }
                    : options
            }
        />
    )
}

export default VerticalBarChart

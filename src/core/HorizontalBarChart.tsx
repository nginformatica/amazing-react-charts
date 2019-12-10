import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TDataTooltip,
    TEntryData,
    TOptionsProps,
    TTooltipProps
} from './types'
import { truncateText } from './auxiliarFunctions'
import { reverse } from 'ramda'

interface IProps extends IDefaultChartProps {
    xComplement?: string
    marginLeft?: string | number
    marginRight?: string | number
}

const HorizontalBarChart = (props: IProps) => {
    const { 
        data, 
        color, 
        xComplement, 
        tooltip: tooltipProps,
        marginLeft,
        marginRight
    } = props
    const xData = reverse(data.map((item: TEntryData) => item.result))
    const yData = reverse(data.map((item: TEntryData) => item.label))
    const backgroundBar = data.map(() => 100)

    const formatTooltip = (chartValues: TDataTooltip) => {
        const { label, result } = tooltipProps
        const { name, data } = chartValues
        const value = xComplement ? data + xComplement : data

        return [
            `${label}: ${name} <br>` +
            `${result}: ${value} <br>`
        ]
    }

    const tooltip: TTooltipProps = {
        formatter: formatTooltip,
        textStyle: { fontSize: 11.5 }
    }

    const options: TOptionsProps = {
        grid: {
            left: marginLeft || '14%',
            right: marginRight || '14%'
        },
        series: [
            {
                barGap: '-100%',
                xAxisIndex: 0,
                type: 'bar',
                animation: false,
                barWidth: '70%',
                barMaxWidth: 25,
                silent: true,
                data: backgroundBar,
                itemStyle: {
                    normal: {
                        color: '#C1C1C1',
                        barBorderRadius: 10,
                        borderColor: props.color
                    }
                }
            },
            {
                xAxisIndex: 0,
                data: xData,
                type: 'bar',
                barWidth: '70%',
                barMaxWidth: 25,
                itemStyle: {
                    normal: {
                        color: color,
                        barBorderRadius: 10
                    }
                },
                label: {
                    formatter: xComplement ? `{c}${xComplement}` : '{c}',
                    position: 'insideRight',
                    fontSize: 11,
                    fontWeight: 400,
                    color: 'black',
                    show: true
                }
            }
        ],
        xAxis: {
            type: 'value',
            data: xData,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            showGrid: false,
            splitLine: {
                show: false
            }
        },
        yAxis: {
            data: yData,
            type: 'category',
            axisLine: {
                show: false
            },
            axisLabel: {
                formatter: truncateText,
                interval: 0
            },
            axisTick: {
                show: false
            },
            showGrid: false,
            splitLine: {
                show: false
            }
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

export default HorizontalBarChart

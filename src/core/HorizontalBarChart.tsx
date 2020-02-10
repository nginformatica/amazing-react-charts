import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TDataTooltip,
    TEntryData,
    TOptionsProps,
    TTooltipProps
} from './types'
import { truncateLabel } from './auxiliarFunctions'
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
        grid: gridProps,
        width,
        labelWordSize
    } = props

    const xData: number[] = reverse(data.map((item: TEntryData) => item.result))
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
            containLabel: true,
            ...gridProps
        },
        series: [
            {
                barGap: '-100%',
                xAxisIndex: 0,
                type: 'bar',
                animation: false,
                barWidth: '80%',
                barMaxWidth: 20,
                silent: true,
                data: backgroundBar,
                itemStyle: {
                    normal: {
                        color: '#ececec',
                        barBorderRadius: 10,
                        borderColor: props.color
                    }
                }
            },
            {
                xAxisIndex: 0,
                data: xData,
                type: 'bar',
                barWidth: '80%',
                barMaxWidth: 20,
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
                formatter: (text: string) => truncateLabel(text, labelWordSize)
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
            lazyUpdate
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

export default HorizontalBarChart

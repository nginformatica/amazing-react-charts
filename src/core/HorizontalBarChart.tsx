import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TDataTooltip,
    TEntryData,
    TEntryWithStyleData,
    TLabelProps,
    TOptionsProps,
    TTooltipProps
} from './types'
import { truncateLabel } from './auxiliarFunctions'
import { reverse } from 'ramda'

interface IProps extends IDefaultChartProps {
    showTickInfos?: boolean
    xComplement?: string
}

const HorizontalBarChart = (props: IProps) => {
    const {
        data,
        color,
        xComplement,
        tooltip: tooltipProps,
        grid: gridProps,
        width,
        labelWordSize,
        showTickInfos
    } = props

    const xData: TEntryWithStyleData[] = reverse(data.map((item: TEntryData) => {
        const label: TLabelProps = item.result <= 2 && {
            position: 'right',
            distance: 1
        }

        return ({
            value: item.result,
            label: label,
            itemStyle: item.style
        })
    }))

    const yData = reverse(data.map((item: TEntryData) => item.label))
    const backgroundBar = data.map(() => 100)

    const formatTooltip = (chartValues: TDataTooltip) => {
        const { label, result } = tooltipProps
        const { name, value } = chartValues

        const dataValue = xComplement ? value + xComplement : value

        return [
            `${label}: ${name} <br>` +
            `${result}: ${dataValue} <br>`
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
                barMaxWidth: !showTickInfos && 20,
                silent: true,
                data: backgroundBar,
                itemStyle: {
                    normal: {
                        color: '#ececec',
                        barBorderRadius: showTickInfos ? 0 : 10,
                        opacity: showTickInfos && 0.5,
                        borderColor: showTickInfos ? undefined : props.color
                    }
                }
            },
            {
                xAxisIndex: 0,
                data: xData,
                type: 'bar',
                barWidth: '80%',
                barMaxWidth: !showTickInfos && 20,
                itemStyle: {
                    normal: {
                        color: color,
                        barBorderRadius: showTickInfos ? 0 : 10
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
                show: showTickInfos || false
            },
            axisLine: {
                show: showTickInfos || false
            },
            axisLabel: {
                show: showTickInfos || false,
                formatter: item => item + xComplement
            },
            showGrid: showTickInfos || false,
            splitLine: {
                show: showTickInfos || false
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
                show: showTickInfos || false,
                alignWithLabel: true
            },
            showGrid: showTickInfos || false,
            splitLine: {
                show: showTickInfos || false
            }
        }
    }

    return (
        <ReactEcharts
            lazyUpdate
            style={ { width: '99%' } }
            opts={ { width: width } }
            onEvents={ { click: props.onClickBar } }
            option={
                tooltipProps
                    ? { ...options, tooltip }
                    : options
            }
        />
    )
}

export default HorizontalBarChart

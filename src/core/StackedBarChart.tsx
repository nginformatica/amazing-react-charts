import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { IDefaultChartProps,
    TOptionsProps,
    TTooltipProps,
    TEntryDataTuples,
    TAxisProps,
    TZoomProps,
    TDataTooltip
} from './AreaChart'
import { formatToBRL } from 'brazilian-values'
import { mountMessage, formatTime, truncateText, toDate } from './auxiliarFunctions'

interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: TEntryDataTuples
    sumDataValues?: boolean
    colors?: [string, string] | [string, string, string]
    secondYAxisType?: 'percent' | string
}

const StackedBarChart = (props: IProps) => {
    const {
        tooltip: tooltipProps,
        data,
        colors,
        xType,
        yComplement,
        secondYAxisType,
        sumDataValues
    } = props

    const { label, bottomResult, topResult, lineResult, complement } = tooltipProps

    const [bottomData, topData, lineData = []] = data
    const yBottomData = bottomData.map(item => item.result)
    const yTopData = topData.map(item => item.result)
    const yLineData = lineData.map(item => item.result)
    const xData = xType === 'time'
        ? bottomData.map(item => toDate(item.label))
        : bottomData.map(item => item.label)

    const formatTooltip = (values: TDataTooltip[]) => {
        const valueBot = values[0] ? Number(values[0].data) : 0
        const valueTop = values[1] ? Number(values[1].data) : 0
        const stackedValues = valueBot + valueTop

        const tooltipBody =
            values.map((value: TDataTooltip) =>
                mountMessage(
                    value,
                    yComplement,
                    secondYAxisType,
                    stackedValues,
                    sumDataValues
                )
            ).join(' ')

        const labelResult = xType === 'time'
            ? label + ': ' + formatTime(values[0].name, 'MMMM yyyy') + '<br>'
            : label + ': ' + values[0].name + '<br>'

        const tooltipFooter = sumDataValues && values.length === 3
            ? complement + ': ' + formatToBRL(stackedValues)
            : ''

        return [labelResult + tooltipBody + tooltipFooter]
    }

    const secondYAxis: TAxisProps = secondYAxisType === 'percent'
        ? {
            type: 'value',
            min: 0,
            max: 100,
            position: 'right',
            axisLine: {
                lineStyle: { color: colors[2] }
            },
            axisLabel: {
                formatter: '{value} %',
                color: colors[2]
            },
            splitLine: {
                show: false
            }
        }
        : {}

    const scrollable: TZoomProps[] = xData.length > 20
        ? [
            {
                type: 'inside',
                endValue: xData[17],
                zoomLock: true
            }, {
                bottom: 250,
                show: true,
                zoomLock: true,
                type: 'slider',
                endValue: xData[17]
            }
        ]
        : []

    const options: TOptionsProps = {
        color: colors,
        series: [
            {
                yAxisIndex: 0,
                name: topResult,
                type: 'bar',
                data: yTopData,
                stack: 'stacked'
            },
            {
                yAxisIndex: 0,
                name: bottomResult,
                type: 'bar',
                data: yBottomData,
                stack: 'stacked'
            },
            {
                yAxisIndex: secondYAxisType === 'percent' ? 1 : 0,
                name: lineResult,
                type: 'line',
                data: yLineData
            }
        ],
        xAxis: {
            data: xData,
            type: 'category',
            axisLabel: {
                formatter: (item: string) => xType === 'time'
                    ? formatTime(item, 'MMM/yy')
                    : truncateText(item, xData.length),
                textStyle: { fontSize: xData.length > 14 ? 10 : 11.5 },
                interval: 0
            },
            splitLine: {
                show: true,
                alignWithLabel: true
            },
            axisTick: {
                show: true,
                alignWithLabel: true
            }
        },
        yAxis: [{
            min: 0,
            type: 'value',
            position: 'left',
            axisLabel: {
                formatter: (item: string) => yComplement === 'money'
                    ? formatToBRL(item)
                    : item + (yComplement || ''),
                textStyle: { fontSize: 11.5 },
                interval: 0
            },
            data: yBottomData,
            splitLine: {
                show: true
            }
        },
            secondYAxis
        ],
        legend: {
            x: 'center',
            y: 'bottom',
            top: 260,
            data: [topResult, bottomResult, lineResult],
            itemGap: 30
        },
        dataZoom: scrollable
    }

    const tooltip: TTooltipProps = {
        formatter: formatTooltip,
        textStyle: { fontSize: 11.5 },
        trigger: 'axis'
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

export default StackedBarChart
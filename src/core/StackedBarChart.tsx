import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IProps,
    IOptions,
    TTooltipProps,
    truncateText,
    TData,
    formatTime,
    toDate,
    TAxisProps
} from './AreaChart'
import { formatToBRL } from 'brazilian-values'

export interface IStackedChartProps extends Omit<IProps, 'data'> {
    data: [TData[], TData[]] | [TData[], TData[], TData[]]
    sumDataValues?: boolean
    colors?: [string, string] | [string, string, string]
    secondYAxisType?: 'percent' | string
}

type TDataTooltip = {
    name?: string
    marker: string
    seriesName: string
    data: number | string
    seriesType: string
}

export const takeComplement = (data: string | number, complement: string) =>
    complement === 'money'
        ? ': ' + formatToBRL(data) + '<br>'
        : ': ' + data + complement + '<br>'

const moneyPercent = (
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
    value: any,
    complement: string,
    axisType: string,
    stackedValues: number,
    sumDataValues: boolean
) =>
    complement === 'money' && value.seriesType !== 'line'
        ? value.marker + value.seriesName + ': ' + ( 
            moneyPercent(value.data, stackedValues, sumDataValues)
        ) 
        : axisType === 'percent'
            ? value.marker + value.seriesName + ': ' + value.data + '% <br>'
            : value.marker + value.seriesName + takeComplement(value.data, complement)



const StackedBarChart = (props: IStackedChartProps) => {
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
                mountMessage(value, 
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

    const options: IOptions = {
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
                    : truncateText(item),
                textStyle: { fontSize: 11.5 },
                interval: 0
            },
            splitLine: {
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
        }
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
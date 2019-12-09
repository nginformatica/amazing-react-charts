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
    colors?: [string, string] | [string, string, string]
    secondYAxisType?: 'percent' | string 
}

type TDataTooltip = {
    name?: string
    marker: string
    seriesName: string
    data: number | string
}

const mountMessage = (value: TDataTooltip, complement: string) => 
    complement === 'money' 
        ? value.marker + value.seriesName + ': ' + formatToBRL(value.data) + '<br>'
        : value.marker + value.seriesName + ': ' + value.data + complement + '<br>'

const StackedBarChart = (props: IStackedChartProps) => {
    const {
        tooltip: tooltipProps,
        data,
        colors,
        xType,
        yComplement,
        secondYAxisType
    } = props
    const { label, bottomResult, topResult, lineResult } = tooltipProps

    const [bottomData, topData, lineData = []] = data
    const yBottomData = bottomData.map(item => item.result)
    const yTopData = topData.map(item => item.result)
    const yLineData = lineData.map(item => item.result)
    const xData = xType === 'time'
        ? bottomData.map(item => toDate(item.label))
        : bottomData.map(item => item.label)

        const formatTooltip = (values: TDataTooltip[]) => {
            const tooltipBody = 
                values.map(
                    (value: TDataTooltip) => mountMessage(value, yComplement)
                ).join(' ')
                
            const labelResult =  xType === 'time' 
                ? label + ': ' + formatTime(values[0].name, 'MMMM yyyy') + '<br>' 
                : label + ': ' + values[0].name + '<br>' 
                
            return [labelResult + tooltipBody ]
        }

    const secondYAxis: TAxisProps = secondYAxisType === 'percent' && { 
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
        }
    }
         
    const options: IOptions = {
        color: colors,
        series: [
            {
                name: topResult,
                type: 'bar',
                data: yTopData,
                stack: 'stacked'
            },
            {
                name: bottomResult,
                type: 'bar',
                data: yBottomData,
                stack: 'stacked'
            },
            {
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
            axisTick: {
                alignWithLabel: true,
                interval: 0
            }
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: (item: string) => yComplement === 'money'
                    ? formatToBRL(item)
                    : item + (yComplement || ''),
                textStyle: { fontSize: 11.5 },
                interval: 0
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
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
    TTooltip
} from './AreaChart'
import { formatToBRL } from 'brazilian-values'

interface IStackedChartProps extends Omit<IProps, 'data'> {
    data: [TData[], TData[]] | [TData[], TData[], TData[]]
    colors?: [string, string] | [string, string, string]
}

const tooltipDefault = { data: 0, marker: '' }

const StackedBarChart = (props: IStackedChartProps) => {
    const {
        tooltip: tooltipProps,
        data,
        colors,
        xType,
        yComplement,
    } = props
    const { label, bottomResult, topResult, lineResult } = tooltipProps

    const [bottomData, topData, lineData = []] = data
    const yBottomData = bottomData.map(item => item.result)
    const yTopData = topData.map(item => item.result)
    const yLineData = lineData.map(item => item.result)
    const xData = xType === 'time'
        ? bottomData.map(item => toDate(item.label))
        : bottomData.map(item => item.label)

        const formatTooltip = (values: any) => {
            const { data: botValue, marker: botMarker } = values[0] ? values[0] : tooltipDefault
            const botToopTip = botMarker + bottomResult + ': ' + formatToBRL(botValue) + '<br>'
            
            const { data: topValue, marker: topMarker } = values[1] ? values[1] : tooltipDefault
            const topToopTip = topMarker + topResult + ': ' + formatToBRL(topValue) + '<br>'
            
            const { data: lineValue, marker: lineMarker } = values[2] ? values[2] : tooltipDefault
            const lineToopTip = lineMarker + lineResult + ': ' + formatToBRL(lineValue) + '<br>'
            
            const labelResult =  xType === 'time' 
                ? label + ':' + formatTime(values[0].name, 'MMMM yyyy') + '<br>' 
                : label + ':' + values[0].name + '<br>' 
                
            return [labelResult + botToopTip + topToopTip + lineToopTip]
        }


    const options: IOptions = {
        color: colors,
        series: [
            {
                name: bottomResult,
                type: 'bar',
                data: yBottomData,
                stack: 'stacked'
            },
            {
                name: topResult,
                type: 'bar',
                data: yTopData,
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
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: (item: string) => yComplement === 'money'
                    ? formatToBRL(item)
                    : item + (yComplement || ''),
                textStyle: { fontSize: 11.5 },
                interval: 0
            }
        },
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
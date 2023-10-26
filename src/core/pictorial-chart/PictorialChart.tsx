import * as React from 'react'
import { EChartsOption } from 'echarts'
import ReactEcharts from 'echarts-for-react'
import { IDefaultChartProps, PictorialEntryData } from '../types'

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: PictorialEntryData[]
    height?: number | string
}

const PictorialChart = (props: IProps) => {
    const formatTooltip = () =>
        `${props.tooltip.label}: ${props.tooltip.labelComplement} <br>` +
        (props.tooltip.result
            ? `${props.tooltip.result}: ${props.tooltip.resultComplement}`
            : '')

    const options: EChartsOption = {
        series: [
            {
                name: 'full',
                silent: true,
                type: 'pictorialBar',
                symbolClip: true,
                symbolBoundingData: 100,
                animationDuration: 0,
                itemStyle: { color: '#ccc' },
                data: [{ value: 100, symbol: props.data[0].symbol }]
            },
            {
                name: 'empty',
                type: 'pictorialBar',
                itemStyle: {
                    color: props.color || 'green'
                },
                animationDuration: 100,
                symbolClip: true,
                symbolBoundingData: 100,
                data: props.data
            }
        ],
        xAxis: {
            data: ['a'],
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false }
        },
        yAxis: {
            max: 100,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false }
        },
        grid: {
            ...props.grid,
            top: 'center',
            show: false
        },
        tooltip: {
            formatter: formatTooltip,
            trigger: 'item' as const,
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: 'white'
            },
            extraCssText: 'border: none; padding: 6px;'
        }
    }

    const CHART_HEIGHT = { width: '99.9%', height: props.height || 500 }

    return <ReactEcharts lazyUpdate option={options} style={CHART_HEIGHT} />
}

export default PictorialChart

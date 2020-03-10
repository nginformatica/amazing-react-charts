import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TOptionsProps,
    TPictorialEntryData,
    TTooltipProps
} from './types'

interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: TPictorialEntryData[]
    height?: number | string
}

const PictorialChart = (props: IProps) => {
    const formatTooltip = () =>
        `${props.tooltip.label}: ${props.tooltip.labelComplement} <br>` + (
            props.tooltip.result 
                ? `${props.tooltip.result}: ${props.tooltip.resultComplement}`
                : ''
        )

    const gridProps = {
        top: 'center',
        ...props.grid
    }

    const tooltip: TTooltipProps = {
        formatter: formatTooltip,
        textStyle: { fontSize: 11.5 },
        trigger: 'item'
    }

    const options: TOptionsProps = {
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
            }],
        xAxis: {
            showGrid: false,
            data: ['a'],
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false }
        },
        yAxis: {
            max: 100,
            showGrid: false,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false }
        },
        grid: gridProps,
        tooltip: tooltip
    }

    return (
        <ReactEcharts
            lazyUpdate
            option={ options }
            style={ {
                width: '99%',
                height: props.height || 500
            } }
        />
    )
}

export default PictorialChart

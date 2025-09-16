import React, { useEffect, useRef } from 'react'
import type { EChartsOption } from 'echarts-for-react'
import { PictorialBarChart as PictorialBarChartEcharts } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import type { IDefaultChartProps, PictorialEntryData } from '../types'
import { TOOLTIP_DEFAULT_PROPS } from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { gray, green } = theme.colors

echarts.use([
    GridComponent,
    CanvasRenderer,
    TooltipComponent,
    PictorialBarChartEcharts
])

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: PictorialEntryData[]
    height?: number | string
}

const PictorialChart = (props: IProps) => {
    const { data, color, grid } = props

    const chartRef = useRef<ReactEChartsCore>(null)

    useEffect(() => {
        const handleResize = () => {
            chartRef.current?.getEchartsInstance().resize()
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const formatTooltip = () =>
        `${props.tooltip?.label}: ${props.tooltip?.labelComplement} <br>` +
        (props.tooltip?.result
            ? `${props.tooltip.result}: ${props.tooltip.resultComplement}`
            : '')

    const options: EChartsOption = () => ({
        series: [
            {
                type: 'pictorialBar',
                name: 'full',
                silent: true,
                symbolClip: true,
                animationDuration: 0,
                symbolBoundingData: 100,
                itemStyle: { color: gray[300] },
                data: [{ value: 100, symbol: data[0].symbol }]
            },
            {
                type: 'pictorialBar',
                name: 'empty',
                data: data,
                symbolClip: true,
                animationDuration: 100,
                symbolBoundingData: 100,
                itemStyle: { color: color || green[500] }
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
        grid: { ...grid, top: 'center', show: false },
        tooltip: {
            trigger: 'item',
            formatter: formatTooltip,
            ...TOOLTIP_DEFAULT_PROPS
        }
    })

    return (
        <ReactEChartsCore
            lazyUpdate
            ref={chartRef}
            echarts={echarts}
            option={options()}
            opts={{ renderer: 'canvas', width: 'auto' }}
            style={{ width: '99.9%', height: props.height || 500 }}
        />
    )
}

export default PictorialChart

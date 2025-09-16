import React, { useEffect, useRef } from 'react'
import type { EChartsOption } from 'echarts-for-react'
import { RadarChart as RadarChartEcharts } from 'echarts/charts'
import {
    TitleComponent,
    LegendComponent,
    TooltipComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import type { LinesFormatterTooltip, WidthProps } from '../types'
import { takeLabelComplement } from '../../lib/auxiliarFunctions'
import { COMMON_STYLE, TOOLTIP_DEFAULT_PROPS } from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { lightGreen } = theme.colors

echarts.use([
    TitleComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    RadarChartEcharts
])

export interface RadarChartProps {
    series: Array<{
        name: string
        color: string
        data: number[]
    }>
    indicators: Array<{
        name: string
        max: number
    }>
    width?: WidthProps
    circular?: boolean
    highlight?: boolean
    yComplement?: (input: string) => string
}

const RadarChart = (props: RadarChartProps) => {
    const { series, width, indicators, circular, highlight, yComplement } =
        props

    const chartRef = useRef<ReactEChartsCore>(null)

    useEffect(() => {
        const handleResize = () => {
            chartRef.current?.getEchartsInstance().resize()
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const takeComplement = (value: number) =>
        takeLabelComplement(Number(value), yComplement ?? '')

    const formatTooltip = (lines: LinesFormatterTooltip) => {
        const linesTooltips = lines.data.value.map(
            (value: string | number, i: number) =>
                indicators[i].name +
                ': ' +
                takeComplement(Number(value)) +
                '<br>'
        )

        return `${lines.name} <br> ${linesTooltips.join(' ')}`
    }

    const seriesData = [
        {
            type: 'radar',
            data: series.map(it => ({
                name: it.name,
                value: it.data
            })),
            ...(highlight && {
                emphasis: {
                    areaStyle: { color: `${lightGreen[300]}90` }
                }
            })
        }
    ]

    const options: EChartsOption = () => ({
        series: seriesData,
        color: series.map(it => it.color),
        radar: {
            shape: circular ? 'circle' : 'polygon',
            indicator: indicators.map(it => ({
                max: it.max,
                name: it.name
            }))
        },
        legend: {
            margin: 0,
            padding: 0,
            data: series.map(it => it.name),
            textStyle: { ...COMMON_STYLE }
        },
        tooltip: {
            trigger: 'item',
            formatter: formatTooltip,
            ...TOOLTIP_DEFAULT_PROPS
        }
    })

    return (
        <ReactEChartsCore
            ref={chartRef}
            echarts={echarts}
            option={options()}
            style={{ width: '99.9%' }}
            opts={{ renderer: 'canvas', width: width ?? 'auto' }}
        />
    )
}

export default RadarChart

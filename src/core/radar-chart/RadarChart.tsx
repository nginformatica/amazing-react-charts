import React from 'react'
import ReactEcharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import type { LinesFormatterTooltip, WidthProps } from '../types'
import { getWidthOpts, takeLabelComplement } from '../../lib/auxiliarFunctions'
import { CHART_WIDTH } from '../../commonStyles'

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
    yComplement?: (input: string) => string
    circular?: boolean
    highlight?: boolean
}

const RadarChart = (props: RadarChartProps) => {
    const { width, series, indicators, yComplement, circular, highlight } =
        props

    const formatTooltip = (lines: LinesFormatterTooltip) => {
        const takeComplement = (value: number) =>
            takeLabelComplement(Number(value), yComplement)

        const linesTooltips = lines.data.value.map(
            (value: string | number, i: number) =>
                indicators[i].name +
                ': ' +
                takeComplement(Number(value)) +
                '<br>'
        )

        return `${lines.name} <br> ${linesTooltips.join(' ')}`
    }

    const emphasis = highlight
        ? {
              emphasis: {
                  areaStyle: {
                      color: 'rgba(0,250,0,0.3)'
                  }
              }
          }
        : {}

    const options: EChartsOption = {
        color: series.map(it => it.color),
        tooltip: {
            formatter: formatTooltip,
            trigger: 'item' as const,
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 13,
                color: '#FFFFFF'
            },
            extraCssText: 'border: none; padding: 6px;'
        },
        legend: {
            data: series.map(it => it.name),
            padding: 0,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400 as const,
                color: '#000000'
            }
        },
        radar: {
            shape: circular ? 'circle' : 'polygon',
            indicator: indicators.map(it => ({
                name: it.name,
                max: it.max
            }))
        },
        series: [
            {
                type: 'radar',
                data: series.map(it => ({
                    name: it.name,
                    value: it.data
                })),
                ...emphasis
            }
        ]
    }

    return (
        <ReactEcharts
            style={CHART_WIDTH}
            opts={getWidthOpts(width || 'auto')}
            option={options}
        />
    )
}

export default RadarChart

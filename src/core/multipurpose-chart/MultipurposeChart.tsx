import React, { useRef } from 'react'
import type { EChartsOption } from 'echarts-for-react'
import {
    BarChart as BarChartEcharts,
    LineChart as LineChartEcharts
} from 'echarts/charts'
import {
    GridComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import type {
    IDefaultChartProps,
    LinesFormatterTooltip,
    WidthProps
} from '../types'
import {
    formatTime,
    timeConvert,
    takeLabelComplement
} from '../../lib/auxiliarFunctions'
import { COMMON_STYLE, TOOLTIP_DEFAULT_PROPS } from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { gray, neutral } = theme.colors

echarts.use([
    GridComponent,
    TitleComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    BarChartEcharts,
    LineChartEcharts,
    DataZoomInsideComponent,
    DataZoomSliderComponent
])

export interface MultipurposeChartProps {
    series: Array<{
        name: string
        color?: string
        data: number[]
    }>
    width?: WidthProps
    dateFormat?: string
    rangeSelector?: boolean
    xData: Array<number | string>
    xType?: IDefaultChartProps['xType']
    yType?: IDefaultChartProps['yType']
    yComplement?: (input: string) => string
}

const MultipurposeChart = (props: MultipurposeChartProps) => {
    const {
        xData,
        xType,
        width,
        yType,
        series,
        dateFormat,
        rangeSelector,
        yComplement
    } = props

    const isStacked = useRef(false)
    const actualGraph = useRef<string>('bar')
    const ref = useRef<EChartsOption | null>(null)

    const isDarkColor = (color: string) => {
        const c = color.substring(1)
        const rgb = parseInt(c, 16)
        const r = (rgb >> 16) & 0xff
        const g = (rgb >> 8) & 0xff
        const b = (rgb >> 0) & 0xff

        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b

        return luma < 40
    }

    const getLabelOptions = (barColor: string) => {
        const isDarkBarColor = isDarkColor(barColor)

        return {
            show: true,
            rotate: 90,
            fontSize: 16,
            align: 'left',
            position: 'insideBottom',
            verticalAlign: 'middle',
            color: isDarkBarColor ? neutral[50] : neutral[200],
            formatter: yComplement && yComplement('{c}') + '  {name|{a}}',
            rich: {
                name: { color: isDarkBarColor ? neutral[50] : neutral[200] }
            }
        }
    }

    const formatTooltip = (lines: LinesFormatterTooltip[]) => {
        const takeComplement = (value: number) =>
            yType === 'time'
                ? timeConvert(Number(value)) + 'h'
                : takeLabelComplement(Number(value), yComplement ?? '')

        const linesTooltips = lines.map(
            line =>
                line.seriesName +
                ': ' +
                takeComplement(Number(line.value)) +
                '<br>'
        )

        const tooltipTitle =
            xType === 'time'
                ? formatTime(
                      dateFormat === 'yyyy-MM'
                          ? lines[0].name + '-02'
                          : lines[0].name,
                      dateFormat === 'yyyy-MM' ? 'MMM/yy' : 'dd MMM'
                  )
                : lines[0].name

        return `${tooltipTitle} <br> ${linesTooltips.join(' ')}`
    }

    const slider = rangeSelector
        ? [
              {
                  type: 'slider',
                  xAxisIndex: 0,
                  filterMode: 'none'
              }
          ]
        : []

    const seriesData = [
        ...series.map(it => ({
            type: 'bar',
            barGap: 0,
            data: it.data,
            name: it.name,
            emphasis: { focus: 'series' },
            label: getLabelOptions(it.color ?? '')
        }))
    ]

    const options: EChartsOption = {
        series: seriesData,
        dataZoom: [...slider],
        color: [...series.map(it => it.color)],
        xAxis: {
            type: yType || 'category',
            data: xData,
            axisTick: { show: false },
            axisLabel: { ...COMMON_STYLE }
        },
        yAxis: {
            type: xType || 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.3,
                    color: gray[800]
                }
            },
            axisTick: { show: true },
            axisLabel: { ...COMMON_STYLE },
            axisLine: { show: true, lineStyle: { color: neutral[200] } }
        },
        legend: {
            data: series.map(it => it.name),
            textStyle: { ...COMMON_STYLE }
        },
        tooltip: {
            trigger: 'axis',
            formatter: formatTooltip,
            axisPointer: { type: 'shadow' },
            ...TOOLTIP_DEFAULT_PROPS
        },
        toolbox: {
            show: true,
            top: 'center',
            left: 'right',
            orient: 'vertical',
            feature: {
                mark: { show: true },
                dataView: {
                    show: true,
                    readOnly: false,
                    title: 'Visualização de dados',
                    lang: ['Visualização de dados', 'Fechar', 'Atualizar']
                },
                magicType: {
                    show: true,
                    type: ['line', 'bar', 'stack'],
                    title: {
                        line: 'Gráfico de linha',
                        bar: 'Gráfico de barras',
                        stack: 'Estacar',
                        title: 'Lado a lado'
                    }
                },
                textStyle: {
                    fontWeight: 400,
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                },
                saveAsImage: { show: true, title: 'Salvar como imagem' }
            }
        }
    }

    const onEvents = {
        magictypechanged: (e: { currentType: 'stack' | 'line' | 'bar' }) => {
            const echartsInstance = ref.current?.getEchartsInstance()
            const actualOptions = echartsInstance?.getOption()

            if (e.currentType === 'stack') {
                isStacked.current = !isStacked.current
            } else {
                actualGraph.current = e.currentType
            }

            const newOptions = { ...actualOptions }

            newOptions.toolbox = options.toolbox

            const isVertical =
                actualGraph.current === 'bar' && !isStacked.current

            const isLine = actualGraph.current === 'line'

            const originalSeries = options.series

            newOptions.series.forEach(
                (
                    it: {
                        label: {
                            color: string
                            align: string
                            rotate: number
                            rich: { name: { color: string } }
                        }
                        type: string
                    },
                    i: number
                ) => {
                    it.label.rotate = isVertical ? 90 : 0
                    it.label.align = isVertical ? 'left' : 'center'
                    it.type = actualGraph.current
                    it.label.rich.name.color = isLine
                        ? neutral[200]
                        : originalSeries[i].label.rich.name.color
                    it.label.color = isLine
                        ? neutral[200]
                        : originalSeries[i].label.color
                }
            )
            ref.current?.getEchartsInstance().setOption(newOptions)
        }
    }

    return (
        <ReactEChartsCore
            ref={ref}
            echarts={echarts}
            option={options}
            style={{ width: '99.9%' }}
            opts={{ renderer: 'canvas', width: width ?? 'auto' }}
            onEvents={onEvents}
        />
    )
}

export default MultipurposeChart

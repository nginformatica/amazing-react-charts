import React from 'react'
import type { EChartsOption } from 'echarts-for-react'
import { BarChart as BarChartEcharts } from 'echarts/charts'
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
import { concat, move } from 'ramda'
import type {
    Tooltip,
    ZoomProps,
    Complement,
    DataTooltip,
    ParamsTooltip,
    EntryDataNTuples,
    DataZoomEventProps,
    IDefaultChartProps,
    TDataZoomChartProps,
    SeriesLabelFormatter
} from '../types'
import {
    toDate,
    fullText,
    formatTime,
    timeConvert,
    normalLabel,
    getDataView,
    mountMessage,
    rotatedLabel,
    truncateLabel,
    dontShowLabel,
    getSaveAsImage,
    monuntTimeMessage,
    generateAuxMessage,
    takeLabelComplement,
    verifyStyleProps
} from '../../lib/auxiliarFunctions'
import {
    TITLE_STYLE,
    COMMON_STYLE,
    LEGEND_STYLE,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
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
    DataZoomInsideComponent,
    DataZoomSliderComponent
])

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    colors?: string[]
    tooltipExtra?: string
    data: EntryDataNTuples
    sumDataValues?: boolean
    legendScrollGap?: number
    additionalResults?: Tooltip[]
    legendType?: 'scroll' | 'none'
    secondYAxisType?: 'percent' | string
}

const StackedBarChart = (props: IProps) => {
    const {
        data,
        grid,
        xType,
        width,
        title,
        colors,
        tooltip,
        barWidth,
        dateFormat,
        legendType,
        yComplement,
        tooltipExtra,
        showBarLabel,
        sumDataValues,
        toolboxTooltip,
        legendScrollGap,
        secondYAxisType,
        additionalResults
    } = props

    const label = tooltip?.label
    const topResult = tooltip?.topResult
    const auxResult = tooltip?.auxResult
    const lineResult = tooltip?.lineResult
    const complement = tooltip?.complement
    const bottomResult = tooltip?.bottomResult
    const extraResult = tooltip?.extraResult ?? '0'

    const [
        bottomData,
        topData,
        lineData = [],
        extraData,
        auxData = [],
        ...additionalData
    ] = data

    const yTopData = topData.map(verifyStyleProps)
    const yLineData = lineData.map(item => item.result)
    const yBottomData = bottomData.map(verifyStyleProps)
    const yExtraData = data.length >= 4 && extraData.map(verifyStyleProps)

    const yTopValue = yTopData.map(item =>
        typeof item === 'object' ? item.value : item
    )
    const yBottomValue = yBottomData.map(item =>
        typeof item === 'object' ? item.value : item
    )

    const topLabels = yBottomValue.map((item, index) => item + yTopValue[index])

    const xData =
        xType === 'time'
            ? bottomData.map(item => toDate(item.label, dateFormat))
            : bottomData.map(item => item.label)

    const formatLabel = (chartValues: SeriesLabelFormatter) => {
        const { dataIndex } = chartValues
        const value = topLabels[dataIndex]

        return takeLabelComplement(Number(value), yComplement ?? '').toString()
    }

    const dynamicDataZoom = (
        item: DataZoomEventProps,
        charts: TDataZoomChartProps
    ) => {
        const dataRange = item.end - item.start
        const dataLimit = 1200 / xData.length
        const fullLabel = 500 / xData.length

        if (xData.length <= 5 || dataRange < fullLabel) {
            charts.setOption(fullText)
        } else if (xData.length <= 14 || dataRange < dataLimit) {
            charts.setOption(normalLabel)
        } else if (dataRange < 40) {
            charts.setOption(rotatedLabel)
        } else {
            charts.setOption(dontShowLabel)
        }
    }

    const formatTooltip = (values: ParamsTooltip[]): string => {
        const takeValue = (
            data: { value: number | string } | string | number
        ) => (typeof data === 'object' ? Number(data.value) : Number(data))

        const valueBot = values[0] ? takeValue(values[0].data) : 0
        const valueTop = values[1] ? takeValue(values[1].data) : 0

        const stackedValues = valueBot + valueTop

        // This function is only used to show auxiliary values on tooltip.
        // We need to improve this component to allow users use it better.
        const getAuxToolTip = (dataIndex: number) =>
            auxData.length && auxData[dataIndex].result >= 0
                ? generateAuxMessage(
                      auxResult ?? '',
                      auxData[dataIndex].result,
                      yComplement ?? ''
                  )
                : ''

        const tooltipValues = values.map((value: DataTooltip) =>
            yComplement === 'time'
                ? monuntTimeMessage(value, stackedValues)
                : mountMessage(
                      value,
                      yComplement ?? '',
                      secondYAxisType ?? '',
                      stackedValues,
                      sumDataValues ?? false
                  )
        )

        const auxTooltip = [getAuxToolTip(values[0].dataIndex)]

        const tooltipBody =
            auxData.length > 0 && auxResult
                ? move(3, 4, concat(tooltipValues, auxTooltip)).join('')
                : tooltipValues.join('')

        const isMoney = (complement: Complement) =>
            typeof yComplement === 'function'
                ? yComplement(stackedValues)
                : `${stackedValues} ${complement}`

        const verifyFormat =
            yComplement === 'time'
                ? timeConvert(stackedValues)
                : isMoney(yComplement ?? '')

        const labelResult =
            xType === 'time'
                ? label + ': ' + formatTime(values[0].name, 'MMM/yy') + '<br>'
                : label + ': ' + values[0].name + '<br>'

        const valueWithoutSecondYAxis =
            sumDataValues && values.length === 2 && !secondYAxisType
                ? complement + ': ' + verifyFormat
                : ''

        const tooltipSumValues =
            sumDataValues &&
            values.length === 3 &&
            secondYAxisType &&
            typeof yComplement === 'function'
                ? complement + ': ' + yComplement(stackedValues)
                : valueWithoutSecondYAxis

        const tooltipFooter =
            tooltipExtra && !sumDataValues ? tooltipExtra : tooltipSumValues

        return labelResult + tooltipBody + tooltipFooter
    }

    const secondYAxis =
        secondYAxisType === 'percent'
            ? {
                  type: 'value',
                  position: 'right',
                  min: 0,
                  max: 100,
                  axisLine: {
                      show: true,
                      lineStyle: { color: colors?.[2] }
                  },
                  axisLabel: {
                      ...COMMON_STYLE,
                      color: colors?.[2],
                      formatter: (item: string) =>
                          takeLabelComplement(Number(item), '%')
                  },
                  axisTick: { show: true },
                  splitLine: { show: false }
              }
            : {}

    const zoomEvent = { dataZoom: dynamicDataZoom }

    const scrollable: ZoomProps[] =
        data[0].length > 12
            ? [
                  {
                      type: 'inside',
                      zoomLock: true,
                      zoomOnMouseWheel: 'shift',
                      endValue:
                          xData.length > 12
                              ? xData[11]
                              : xData[xData.length - 1]
                  },
                  {
                      type: 'slider',
                      show: true,
                      endValue:
                          xData.length > 12
                              ? xData[11]
                              : xData[xData.length - 1]
                  }
              ]
            : []

    const extraStackedSerie = yExtraData && {
        type: 'bar',
        yAxisIndex: 0,
        stack: 'stacked',
        data: yExtraData,
        name: extraResult,
        barWidth: barWidth
    }

    const additionalResultsMap = additionalResults
        ? additionalResults.map(it => it.name)
        : []

    const aditionalSeries = additionalData.map((it, i) =>
        additionalResults?.[i].type === 'bar'
            ? {
                  type: 'bar',
                  stack: 'stacked',
                  yAxisIndex: 0,
                  barWidth: barWidth,
                  data: it.map(verifyStyleProps),
                  name: additionalResults[i].name
              }
            : {
                  type: 'line',
                  data: it.map(verifyStyleProps),
                  name: additionalResults?.[i].name,
                  yAxisIndex: secondYAxisType === 'percent' ? 1 : 0
              }
    )

    const series = [
        {
            type: 'bar',
            stack: 'stacked',
            yAxisIndex: 0,
            data: yTopData,
            name: topResult,
            barWidth: barWidth
        },
        {
            type: 'bar',
            stack: 'stacked',
            yAxisIndex: 0,
            data: yBottomData,
            barWidth: barWidth,
            name: bottomResult,
            label: {
                distance: 2,
                fontSize: 12,
                position: 'top',
                show: showBarLabel,
                formatter: formatLabel,
                color: neutral[200]
            }
        },
        extraStackedSerie,
        {
            type: 'line',
            data: yLineData,
            name: lineResult,
            yAxisIndex: secondYAxisType === 'percent' ? 1 : 0
        },
        ...aditionalSeries
    ]

    const legendProps =
        legendType === 'scroll'
            ? {
                  top: 270,
                  type: legendType,
                  itemGap: legendScrollGap || 60,
                  data: [
                      topResult,
                      bottomResult,
                      extraResult,
                      lineResult,
                      ...additionalResultsMap
                  ],
                  textStyle: { ...LEGEND_STYLE }
              }
            : {
                  top: 30,
                  itemGap: 30,
                  data: [
                      topResult,
                      bottomResult,
                      extraResult,
                      lineResult,
                      ...additionalResultsMap
                  ],
                  textStyle: { ...LEGEND_STYLE }
              }

    const toolbox = toolboxTooltip && {
        showTitle: false,
        right: '8.7%',
        feature: {
            saveAsImage:
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage.title ?? ''),
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title ?? '')
        }
    }

    const options: EChartsOption = () => ({
        grid: grid,
        color: colors,
        series: series,
        dataZoom: scrollable,
        title: {
            text: title,
            top: legendType === 'scroll' && '5.7%',
            left: legendType === 'scroll' ? '0.1%' : '4%',
            textStyle: { ...TITLE_STYLE }
        },
        xAxis: {
            data: xData,
            type: 'category',
            boundaryGap: true,
            splitLine: {
                show: true,
                alignWithLabel: true,
                lineStyle: { opacity: 0.3, color: gray[800] }
            },
            axisLabel: {
                ...COMMON_STYLE,
                fontSize: xData.length > 14 ? 10 : 11.5,
                interval: xData.length > 20 ? 'auto' : 0,
                formatter: (item: string) =>
                    xType === 'time'
                        ? formatTime(item, 'MMM/yy')
                        : truncateLabel(item)
            },
            axisTick: { show: true, alignWithLabel: true }
        },
        yAxis: [
            {
                type: 'value',
                position: 'left',
                min: 0,
                splitLine: {
                    show: true,
                    lineStyle: { opacity: 0.3, color: gray[800] }
                },
                axisLabel: {
                    ...LEGEND_STYLE,
                    formatter: (item: string) =>
                        takeLabelComplement(
                            Number(item),
                            yComplement ?? ''
                        ).toString()
                },
                axisLine: { show: true },
                axisTick: { show: true, alignWithLabel: true }
            },
            secondYAxis
        ],
        legend: legendType === 'none' ? { show: false } : legendProps,
        tooltip: tooltip && {
            trigger: 'axis',
            formatter: formatTooltip,
            ...TOOLTIP_DEFAULT_PROPS
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: (param: { title: string }) =>
                    `<div>${param.title}</div>`
            }
        }
    })

    return (
        <ReactEChartsCore
            notMerge
            echarts={echarts}
            option={options()}
            style={{ width: '99.9%' }}
            opts={{ renderer: 'canvas', width: width ?? 'auto' }}
            onEvents={zoomEvent}
        />
    )
}

export default StackedBarChart

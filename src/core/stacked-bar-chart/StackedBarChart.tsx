import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { concat, move } from 'ramda'
import type {
    IDefaultChartProps,
    DataTooltip,
    TDataZoomChartProps,
    DataZoomEventProps,
    EntryData,
    EntryDataNTuples,
    ZoomProps,
    ParamsTooltip,
    Complement,
    Tooltip,
    SeriesLabelFormatter
} from '../types'
import type { EChartsOption } from 'echarts/types/dist/echarts'
import {
    formatTime,
    getDataView,
    getSaveAsImage,
    monuntTimeMessage,
    mountMessage,
    timeConvert,
    toDate,
    truncateLabel,
    takeLabelComplement,
    generateAuxMessage,
    getWidthOpts
} from '../../lib/auxiliarFunctions'
import {
    dontShowLabel,
    fullText,
    normalLabel,
    rotatedLabel
} from '../vertical-bar-chart/VerticalBarChart'
import { CHART_WIDTH, TOOLTIP_DEFAULT_PROPS } from '../../commonStyles'

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: EntryDataNTuples
    tooltipExtra?: string
    sumDataValues?: boolean
    colors?: string[]
    legendType?: 'scroll' | 'none'
    legendScrollGap?: number
    secondYAxisType?: 'percent' | string
    additionalResults?: Tooltip[]
}

const verifyStyleProps = (data: EntryData) =>
    data.style ? { value: data.result, itemStyle: data.style } : data.result

const StackedBarChart = (props: IProps) => {
    const {
        tooltip: tooltipProps,
        data,
        colors,
        xType,
        yComplement,
        secondYAxisType,
        sumDataValues,
        dateFormat,
        grid: gridProps,
        width,
        barWidth,
        title: titleProps,
        toolboxTooltip,
        tooltipExtra,
        legendType,
        legendScrollGap,
        showBarLabel,
        additionalResults
    } = props

    const label = tooltipProps?.label
    const bottomResult = tooltipProps?.bottomResult
    const topResult = tooltipProps?.topResult
    const extraResult = tooltipProps?.extraResult ?? '0'
    const lineResult = tooltipProps?.lineResult
    const auxResult = tooltipProps?.auxResult
    const complement = tooltipProps?.complement

    const [
        bottomData,
        topData,
        lineData = [],
        extraData,
        auxData = [],
        ...aditionalData
    ] = data

    const yBottomData = bottomData.map(verifyStyleProps)

    const yTopData = topData.map(verifyStyleProps)

    const yExtraData =
        data.length >= 4 && extraData.map((item: EntryData) => item.result)

    const yBottomValue = yBottomData.map(item =>
        typeof item === 'object' ? item.value : item
    )

    const yTopValue = yTopData.map(item =>
        typeof item === 'object' ? item.value : item
    )

    const topLabels = yBottomValue.map((item, index) => item + yTopValue[index])

    const formatLabel = (chartValues: SeriesLabelFormatter) => {
        const { dataIndex } = chartValues
        const value = topLabels[dataIndex]

        return takeLabelComplement(Number(value), yComplement ?? '').toString()
    }

    const yLineData = lineData.map((item: EntryData) => item.result)

    const xData =
        xType === 'time'
            ? bottomData.map((item: EntryData) =>
                  toDate(item.label, dateFormat)
              )
            : bottomData.map((item: EntryData) => item.label)

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

    const zoomEvent = { dataZoom: dynamicDataZoom }

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
                      auxResult as string,
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
                  type: 'value' as const,
                  min: 0,
                  max: 100,
                  position: 'right' as const,
                  axisLine: {
                      show: true,
                      lineStyle: { color: colors?.[2] }
                  },
                  axisLabel: {
                      formatter: (item: string) =>
                          takeLabelComplement(Number(item), '%'),
                      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: 400 as const,
                      color: colors?.[2]
                  },
                  axisTick: {
                      show: true
                  },
                  splitLine: {
                      show: false
                  }
              }
            : {}

    const scrollable: ZoomProps[] =
        data[0].length > 12
            ? [
                  {
                      type: 'inside',
                      endValue:
                          xData.length > 12
                              ? xData[11]
                              : xData[xData.length - 1],
                      zoomLock: true,
                      zoomOnMouseWheel: 'shift'
                  },
                  {
                      show: true,
                      type: 'slider',
                      endValue:
                          xData.length > 12
                              ? xData[11]
                              : xData[xData.length - 1]
                  }
              ]
            : []

    const toolbox: object | undefined = toolboxTooltip && {
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

    const extraStackedSerie: object | boolean = yExtraData && {
        barWidth: barWidth,
        yAxisIndex: 0,
        name: extraResult,
        type: 'bar',
        data: yExtraData,
        stack: 'stacked'
    }

    const additionalResultsMap = additionalResults
        ? additionalResults.map(it => it.name)
        : []

    const aditionalSeries = aditionalData.map((it, i) =>
        additionalResults?.[i].type === 'bar'
            ? {
                  barWidth,
                  yAxisIndex: 0,
                  name: additionalResults[i].name,
                  type: 'bar',
                  data: it.map(verifyStyleProps),
                  stack: 'stacked'
              }
            : {
                  yAxisIndex: secondYAxisType === 'percent' ? 1 : 0,
                  name: additionalResults?.[i].name,
                  type: 'line',
                  data: it.map(verifyStyleProps)
              }
    )

    const legendProps =
        legendType === 'scroll'
            ? {
                  data: [
                      topResult,
                      bottomResult,
                      extraResult,
                      lineResult,
                      ...additionalResultsMap
                  ],
                  top: 270,
                  type: legendType,
                  itemGap: legendScrollGap || 60,
                  textStyle: {
                      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: 400 as const,
                      color: '#000000',
                      fontSize: 11.5
                  }
              }
            : {
                  top: 30,
                  data: [
                      topResult,
                      bottomResult,
                      extraResult,
                      lineResult,
                      ...additionalResultsMap
                  ],
                  itemGap: 30,
                  textStyle: {
                      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: 400 as const,
                      color: '#000000',
                      fontSize: 11.5
                  }
              }

    const options: EChartsOption = {
        grid: gridProps,
        color: colors,
        // @ts-expect-error fix
        series: [
            {
                barWidth: barWidth,
                yAxisIndex: 0,
                name: topResult,
                type: 'bar',
                data: yTopData,
                stack: 'stacked'
            },
            {
                barWidth: barWidth,
                yAxisIndex: 0,
                name: bottomResult,
                type: 'bar',
                data: yBottomData,
                stack: 'stacked',
                label: {
                    formatter: formatLabel,
                    show: showBarLabel,
                    position: 'top',
                    fontSize: 12,
                    color: '#000000',
                    distance: 2
                }
            },
            extraStackedSerie,
            {
                yAxisIndex: secondYAxisType === 'percent' ? 1 : 0,
                name: lineResult,
                type: 'line',
                data: yLineData
            },
            ...aditionalSeries
        ],
        xAxis: {
            data: xData as string[],
            type: 'category' as const,
            boundaryGap: true,
            axisLabel: {
                formatter: (item: string) =>
                    xType === 'time'
                        ? formatTime(item, 'MMM/yy')
                        : truncateLabel(item),
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: xData.length > 14 ? 10 : 11.5,
                fontWeight: 400 as const,
                color: '#000000',
                interval: xData.length > 20 ? 'auto' : 0
            },
            splitLine: {
                // @ts-expect-error issue
                // https://github.com/apache/incubator-echarts/issues/13618
                alignWithLabel: true,
                show: true,
                lineStyle: {
                    opacity: 0.3,
                    color: 'gray'
                }
            },
            axisTick: {
                show: true,
                alignWithLabel: true
            }
        },
        yAxis: [
            {
                min: 0,
                type: 'value' as const,
                position: 'left' as const,
                axisLabel: {
                    formatter: (item: string) =>
                        takeLabelComplement(
                            Number(item),
                            yComplement ?? ''
                        ).toString(),
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: 400 as const,
                    color: '#000000',
                    fontSize: 11.5
                },
                axisTick: { show: true, alignWithLabel: true },
                axisLine: {
                    show: true
                },
                splitLine: {
                    // @ts-expect-error issue
                    // https://github.com/apache/incubator-echarts/issues/13618
                    alignWithLabel: true,
                    show: true,
                    lineStyle: {
                        opacity: 0.3,
                        color: 'gray'
                    }
                }
            },
            secondYAxis
        ],
        // @ts-expect-error fix
        legend: legendType === 'none' ? undefined : legendProps,
        dataZoom: scrollable,
        // @ts-expect-error fix
        title: {
            left: legendType === 'scroll' ? '0.1%' : '4%',
            top: legendType === 'scroll' && '5.7%',
            show: titleProps !== undefined,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: '#000000'
            }
        },
        tooltip: tooltipProps && {
            formatter: formatTooltip,
            trigger: 'axis' as const,
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: '#FFFFFF'
            },
            extraCssText: 'border: none; padding: 6px;'
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: param => `<div>${param.title}</div>`
            }
        }
    }

    return (
        <ReactEcharts
            notMerge
            style={CHART_WIDTH}
            opts={getWidthOpts(width || 'auto')}
            option={options}
            onEvents={zoomEvent}
        />
    )
}

export default StackedBarChart

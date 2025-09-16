import React, { useEffect, useRef } from 'react'
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
import type {
    ZoomProps,
    LabelProps,
    EChartSeries,
    TooltipFormatter,
    IDefaultChartProps,
    DataZoomEventProps,
    TDataZoomChartProps,
    VerticalBarLabelFormatter,
    EntryData
} from '../types'
import {
    fullText,
    getDomain,
    formatTime,
    getDataView,
    timeConvert,
    normalLabel,
    rotatedLabel,
    formatTooltip,
    dontShowLabel,
    getSaveAsImage,
    getInitialValues,
    getDateFormatType,
    fixedTruncateLabel,
    takeLabelComplement,
    rotatedLabelSpecial
} from '../../lib/auxiliarFunctions'
import {
    TITLE_STYLE,
    LEGEND_STYLE,
    AXIS_SPLIT_LINE,
    TOOLTIP_DEFAULT_PROPS,
    COMMON_STYLE
} from '../../commonStyles'

echarts.use([
    GridComponent,
    TitleComponent,
    LegendComponent,
    CanvasRenderer,
    TooltipComponent,
    ToolboxComponent,
    BarChartEcharts,
    DataZoomInsideComponent,
    DataZoomSliderComponent
])

type BarChartData = EntryData[] | EntryData[][]

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: BarChartData
    interval?: number
    rotateTickLabel?: number
    customMaxDomain?: number
    legendType?: 'scroll' | 'plain'
}

const VerticalBarChart = (props: IProps) => {
    const {
        grid,
        data,
        color,
        xType,
        yType,
        width,
        title,
        tooltip,
        barWidth,
        interval,
        dateFormat,
        legendType,
        rotateLabel,
        yComplement,
        scrollStart,
        showBarLabel,
        titleFontSize,
        toolboxTooltip,
        customMaxDomain,
        marginLeftTitle,
        tooltipComplement,
        marginRightToolbox,
        isMoreThanHundredPercent,
        onClickBar
    } = props

    const chartRef = useRef<ReactEChartsCore>(null)

    useEffect(() => {
        const handleResize = () => {
            chartRef.current?.getEchartsInstance().resize()
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const isCustomDomain = customMaxDomain ? customMaxDomain : getDomain

    const isStackedData = (data: BarChartData): data is EntryData[][] => {
        return Array.isArray(data[0])
    }

    const isStacked = isStackedData(data)

    const xData = isStacked
        ? data[0].map(item => item.label)
        : data.map(item => item.label)

    const yData: EChartSeries = (data as EntryData[]).map(item => {
        const results = (data as EntryData[]).map(item => item.result)
        const maxValue = Math.max(...results)

        const label: LabelProps | false | undefined =
            showBarLabel && item.result <= 10
                ? {
                      position: 'top',
                      distance: 1
                  }
                : false

        if (maxValue !== item.result) {
            const mainPercentage = (item.result * 100) / maxValue

            const label: LabelProps =
                mainPercentage < 15 ? { position: 'top', distance: 1 } : {}

            return {
                value: item.result,
                label: label,
                itemStyle: item.style,
                itemId: item.itemId && item.itemId
            }
        }

        return {
            value: item.result,
            label: label,
            itemStyle: item.style,
            itemId: item.itemId && item.itemId
        }
    })

    const specialLabel = (item: string) =>
        fixedTruncateLabel(item, xData.length <= 5 ? 16 : 9)

    const dynamicDataZoom = (
        item: DataZoomEventProps,
        charts: TDataZoomChartProps
    ) => {
        const dataRange = item.end - item.start
        const fullLabel = 500 / xData.length
        const minimum = 800 / xData.length

        if (rotateLabel) {
            if (xData.length <= 5 || dataRange < minimum) {
                charts.setOption(fullText)
            } else {
                if (dataRange > fullLabel && xData.length <= 40) {
                    charts.setOption(rotatedLabelSpecial(rotateLabel))
                } else {
                    charts.setOption(dontShowLabel)
                }
            }
        } else {
            const dataLimit = 1200 / xData.length

            if (xData.length <= 5 || dataRange < fullLabel) {
                charts.setOption(fullText)
            } else if (xData.length <= 12 || dataRange < dataLimit) {
                charts.setOption(normalLabel)
            } else if (dataRange < 40) {
                charts.setOption(rotatedLabel)
            } else {
                charts.setOption(dontShowLabel)
            }
        }
    }

    const formatLabel = (chartValues: VerticalBarLabelFormatter) => {
        const { value } = chartValues
        const isTimeType = yType === 'time'

        return isTimeType
            ? timeConvert(Number(value)) + 'h'
            : String(takeLabelComplement(Number(value), yComplement ?? ''))
    }

    const formatSingleTooltip = (chartValues: TooltipFormatter[]) => {
        const { axisValueLabel, value } = chartValues[0]

        const label = tooltip?.label
        const result = tooltip?.result
        const complement = tooltipComplement ? tooltipComplement : ''

        const values =
            yType === 'time'
                ? timeConvert(Number(value)) + 'h'
                : takeLabelComplement(Number(value), yComplement ?? '')

        const labelPrint =
            xType === 'time'
                ? formatTooltip(axisValueLabel, dateFormat)
                : axisValueLabel

        return (
            `${label}: ${labelPrint} <br>` +
            `${result}: ${values} <br>` +
            complement
        )
    }

    const events = {
        dataZoom: dynamicDataZoom,
        click: onClickBar ?? (() => {})
    }

    const series = isStacked
        ? data.map(serie => ({
              type: 'bar',
              stack: 'stacked',
              barWidth: barWidth || 'auto',
              name: serie[0]?.name || '',
              data: serie.map(item => ({
                  value: item.result,
                  itemStyle: item.style
              })),
              itemStyle: { color: serie[0]?.style?.color || undefined },
              label: {
                  ...LEGEND_STYLE,
                  distance: 6,
                  fontSize: 12,
                  show: showBarLabel,
                  position: 'insideTop',
                  formatter: formatLabel
              }
          }))
        : [
              {
                  type: 'bar',
                  data: yData,
                  barWidth: barWidth || 'auto',
                  label: {
                      ...LEGEND_STYLE,
                      distance: 6,
                      fontSize: 12,
                      show: showBarLabel,
                      position: 'insideTop',
                      formatter: formatLabel
                  }
              }
          ]

    const arrayInitialSize = scrollStart || (dateFormat === 'yyyy-MM' ? 12 : 30)

    const scrollable: ZoomProps[] =
        data.length > arrayInitialSize
            ? [
                  {
                      type: 'inside',
                      start: getInitialValues(
                          xData.length,
                          dateFormat,
                          scrollStart
                      ),
                      endValue:
                          xData.length > 12
                              ? xData[11]
                              : xData[xData.length - 1],
                      zoomOnMouseWheel: 'shift'
                  },
                  {
                      show: true,
                      type: 'slider',
                      start: getInitialValues(
                          xData.length,
                          dateFormat,
                          scrollStart
                      ),
                      endValue:
                          xData.length > 12
                              ? xData[11]
                              : xData[xData.length - 1]
                  }
              ]
            : []

    const toolbox = toolboxTooltip && {
        showTitle: false,
        right: marginRightToolbox || '8.7%',
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
        interval,
        series: series,
        grid: { ...grid },
        dataZoom: scrollable,
        color: color && [color],
        title: {
            text: title,
            left: marginLeftTitle || '5.9%',
            textStyle: { ...TITLE_STYLE, fontSize: titleFontSize || 16 }
        },
        xAxis: {
            type: 'category',
            data: xData,
            showGrid: true,
            boundaryGap: true,
            splitLine: {
                show: true,
                alignWithLabel: true,
                lineStyle: { ...AXIS_SPLIT_LINE }
            },
            axisLabel: {
                ...LEGEND_STYLE,
                interval: 0,
                fontSize: 11,
                rotate: rotateLabel && rotateLabel,
                formatter: (item: string) =>
                    xType === 'time'
                        ? formatTime(
                              item,
                              getDateFormatType(
                                  dateFormat ?? 'yyyy-MM',
                                  'dd/MM/yyyy'
                              )
                          )
                        : specialLabel(item)
            },
            axisTick: { show: true, alignWithLabel: true }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: { ...AXIS_SPLIT_LINE }
            },
            axisLabel: {
                ...LEGEND_STYLE,
                fontSize: 11,
                formatter: (item: number) =>
                    yType === 'time'
                        ? timeConvert(item) + 'h'
                        : String(takeLabelComplement(item, yComplement ?? ''))
            },
            axisLine: { show: true },
            axisTick: { show: true, alignWithLabel: true },
            max:
                !isMoreThanHundredPercent && yComplement === '%'
                    ? 100
                    : isCustomDomain
        },
        legend: {
            top: '90%',
            itemGap: 24,
            type: legendType || 'plain',
            textStyle: { ...COMMON_STYLE }
        },
        tooltip: tooltip && {
            trigger: 'axis',
            formatter: formatSingleTooltip,
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
            lazyUpdate
            ref={chartRef}
            echarts={echarts}
            option={options()}
            style={{ width: '99.9%' }}
            opts={{ renderer: 'canvas', width: width ?? 'auto' }}
            onEvents={events}
        />
    )
}

export default VerticalBarChart

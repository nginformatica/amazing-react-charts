import React from 'react'
import type { EChartsOption } from 'echarts-for-react'
import { LineChart as LineChartEcharts } from 'echarts/charts'
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
    AreaDataTooltip,
    DataZoomEventProps,
    IDefaultChartProps,
    TDataZoomChartProps,
    SeriesLabelFormatter
} from '../types'
import {
    fixedDomain,
    formatTime,
    formatTooltip,
    getDataView,
    getDateFormatType,
    getSaveAsImage,
    getDomain,
    getInitialValues,
    timeConvert,
    takeLabelComplement
} from '../../lib/auxiliarFunctions'
import {
    TITLE_STYLE,
    COMMON_STYLE,
    AXIS_SPLIT_LINE,
    STRAIGHT_LINE_ICON,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { blue, neutral } = theme.colors

echarts.use([
    GridComponent,
    TitleComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    LineChartEcharts,
    DataZoomInsideComponent,
    DataZoomSliderComponent
])

const AreaChart = (props: IDefaultChartProps) => {
    const {
        data,
        grid,
        color,
        width,
        title,
        yType,
        xType,
        tooltip,
        dateFormat,
        yComplement,
        rotateLabel,
        scrollStart,
        fontLabelSize,
        toolboxTooltip,
        tooltipComplement,
        lineMarkName = '',
        lineMarkValue = 0,
        lineMarkColor = ''
    } = props

    const xData = data.map(item => item.label)
    const chartData = data.map(item => item.result)

    const markLineData = lineMarkValue && xData.map(() => lineMarkValue)

    const formatDinamicLabel = (chartValues: SeriesLabelFormatter) => {
        const { data } = chartValues

        return yType === 'time'
            ? timeConvert(Number(data)).toString() + 'h'
            : takeLabelComplement(Number(data), yComplement ?? '').toString()
    }

    const formatSingleTooltip = (chartValues: AreaDataTooltip[]) => {
        const { axisValueLabel, data } = chartValues[0]

        const label = tooltip?.label
        const result = tooltip?.result

        const complement = tooltipComplement ? tooltipComplement : ''

        const values =
            yType === 'time'
                ? timeConvert(Number(data)) + 'h'
                : takeLabelComplement(
                      Number(data),
                      yComplement ?? ''
                  ).toString()

        return `${label}: ${formatTooltip(axisValueLabel, dateFormat)} <br>
      ${result}: ${values} <br>
      ${complement}`
    }

    const formatLabel = (item: { data: number }) => {
        const { data } = item

        if (typeof yComplement === 'function' && typeof item === 'object') {
            return yComplement(item.data)
        }

        if (typeof yComplement === 'function') {
            return yComplement
        }

        if (yType === 'time') {
            return timeConvert(Number(data)).toString() + 'h'
        }

        return takeLabelComplement(Number(data), '').toString()
    }

    const dinamicData = (
        item: DataZoomEventProps,
        charts: TDataZoomChartProps
    ) => {
        const isTime = yType === 'time' ? 3400 : 4500

        const dataRange = item.end - item.start
        const dataLimit = scrollStart
            ? (scrollStart * 100 + 400) / xData.length
            : isTime / xData.length

        if (dataRange < dataLimit) {
            return charts.setOption({
                series: [
                    {
                        label: {
                            show: true,
                            distance: 1.1,
                            color: neutral[200],
                            formatter: formatDinamicLabel,
                            fontSize: yType === 'time' ? 10 : 11.5
                        }
                    }
                ]
            })
        }

        charts.setOption({ series: [{ label: { show: false } }] })
    }

    const series = {
        type: 'line',
        data: chartData,
        label: {
            show: true,
            distance: 1.1,
            formatter: formatLabel,
            fontSize: yType === 'time' ? 10 : 11.5,
            ...COMMON_STYLE
        },
        itemStyle: { color: color },
        lineStyle: { color: color || blue[800] },
        areaStyle: {
            opacity: 0.2,
            color: color || blue[800]
        }
    }

    const seriesMarkLine = {
        type: 'line',
        symbolSize: 0,
        showSymbol: false,
        data: markLineData,
        name: lineMarkName,
        emphasis: { scale: false },
        lineStyle: { width: 2, color: lineMarkColor }
    }

    const zoomEvent = { dataZoom: dinamicData }

    const arrayInitialSize = scrollStart || (dateFormat === 'yyyy-MM' ? 12 : 30)

    const tooltipLabelFormat =
        dateFormat === 'yyyy-MM' ? 'MMM/yy' : 'dd/MM/yyyy'

    const scrollable: ZoomProps[] =
        xData.length > arrayInitialSize
            ? [
                  {
                      type: 'inside',
                      end: 100,
                      zoomLock: true,
                      zoomOnMouseWheel: 'shift',
                      start: getInitialValues(
                          xData.length,
                          dateFormat,
                          scrollStart
                      )
                  },
                  {
                      type: 'slider',
                      show: true,
                      bottom: 10,
                      end: 100,
                      start: getInitialValues(
                          xData.length,
                          dateFormat,
                          scrollStart
                      ),
                      labelFormatter: (_: string, item: string) =>
                          formatTime(item, tooltipLabelFormat)
                  }
              ]
            : []

    const toolbox = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
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
        dataZoom: scrollable,
        color: [lineMarkColor],
        series: [series, seriesMarkLine],
        grid: { ...(grid || { bottom: 75 }), show: true },
        title: {
            text: title,
            left: '6.2%',
            textStyle: { ...TITLE_STYLE }
        },
        xAxis: {
            type: 'category',
            data: xData,
            boundaryGap: false,
            splitLine: {
                show: true,
                lineStyle: { ...AXIS_SPLIT_LINE }
            },
            axisLabel: {
                ...COMMON_STYLE,
                rotate: rotateLabel || 0,
                fontSize: fontLabelSize || 11.5,
                formatter: (item: string) =>
                    xType === 'time'
                        ? formatTime(
                              item,
                              getDateFormatType(dateFormat || 'yyyy-MM')
                          )
                        : item
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: { ...AXIS_SPLIT_LINE }
            },
            axisTick: { show: true },
            axisLine: {
                show: true,
                type: 'dashed',
                lineStyle: { color: neutral[200] }
            },
            axisLabel: {
                ...COMMON_STYLE,
                fontSize: fontLabelSize || 11.5,
                margin: yType === 'time' ? 16 : 14,
                formatter: (item: number) =>
                    yType === 'time'
                        ? timeConvert(item) + 'h'
                        : takeLabelComplement(
                              item,
                              yComplement ?? ''
                          ).toString()
            },
            max: lineMarkValue ? fixedDomain : getDomain
        },
        legend: {
            top: 30,
            icon: STRAIGHT_LINE_ICON,
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
            echarts={echarts}
            option={options()}
            style={{ width: '99.9%', height: 300 }}
            opts={{ renderer: 'canvas', width: width ?? 'auto' }}
            onEvents={zoomEvent}
        />
    )
}

export default AreaChart

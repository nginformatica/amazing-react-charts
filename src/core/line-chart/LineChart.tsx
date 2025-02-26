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
    IDefaultChartProps,
    LinesFormatterTooltip,
    ZoomProps
} from '../types'
import {
    formatTime,
    getDataView,
    getDateFormatType,
    getInitialValues,
    getSaveAsImage,
    takeLabelComplement,
    timeConvert
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

const { neutral } = theme.colors

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

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: {
        name: string
        type?: string
        data: number[]
    }[]
    smooth?: boolean
    colors?: string[]
    xAxisData: string[]
    showLabel?: boolean
    disableMarks?: boolean
    axisNames?: { x: string; y: string }
}

export const LineChart = (props: IProps) => {
    const {
        data,
        grid,
        title,
        width,
        xType,
        yType,
        colors,
        smooth,
        xAxisData,
        showLabel,
        dateFormat,
        rotateLabel,
        scrollStart,
        yComplement,
        disableMarks,
        fontLabelSize,
        toolboxTooltip
    } = props

    const formatLabel = (item: { data: number }) => {
        const { data } = item

        if (typeof yComplement === 'function' && typeof item === 'object') {
            return yComplement(item.data)
        }

        if (typeof yComplement === 'function') {
            return yComplement
        }

        return yType === 'time'
            ? timeConvert(Number(data)) + 'h'
            : takeLabelComplement(Number(data), yComplement ?? '')
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
                      getDateFormatType(dateFormat ?? 'yyyy-MM')
                  )
                : lines[0].name

        return `${tooltipTitle} <br> ${linesTooltips.join(' ')}`
    }

    const arrayInitialSize = scrollStart || (dateFormat === 'yyyy-MM' ? 12 : 30)

    const tooltipLabelFormat =
        dateFormat === 'yyyy-MM' ? 'MMM/yy' : 'dd/MM/yyyy'

    const scrollable: ZoomProps[] =
        xAxisData.length > arrayInitialSize
            ? [
                  {
                      type: 'inside',
                      start: getInitialValues(
                          xAxisData.length,
                          dateFormat,
                          scrollStart
                      ),
                      end: 100,
                      zoomLock: true,
                      zoomOnMouseWheel: 'shift'
                  },
                  {
                      show: true,
                      bottom: 10,
                      type: 'slider',
                      start: getInitialValues(
                          xAxisData.length,
                          dateFormat,
                          scrollStart
                      ),
                      end: 100,
                      labelFormatter: (_: string, item2: string) =>
                          formatTime(item2, tooltipLabelFormat)
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

    const series = data.map(item => ({
        ...item,
        smooth: smooth,
        showSymbol: !disableMarks,
        type: item.type ?? 'line',
        label: {
            distance: 1.1,
            show: showLabel,
            color: neutral[200],
            formatter: formatLabel,
            fontSize: yType === 'time' ? 10 : 11.5
        },
        lineStyle: {
            width: 1.5,
            type: item.name === 'ref' ? 'dashed' : undefined
        }
    }))

    const getOption: EChartsOption = () => ({
        color: colors,
        series: series,
        dataZoom: scrollable,
        grid: { ...(grid || { bottom: 75 }), show: true },
        title: {
            text: title,
            left: '6.2%',
            textStyle: { ...TITLE_STYLE }
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
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
                              dateFormat === 'yyyy-MM' ? item + '-02' : item,
                              getDateFormatType(dateFormat ?? 'yyyy-MM')
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
                type: 'solid',
                lineStyle: { color: neutral[200] }
            },
            axisLabel: {
                ...COMMON_STYLE,
                fontSize: fontLabelSize || 11.5,
                margin: yType === 'time' ? 16 : 14,
                formatter: (item: number) =>
                    yType === 'time'
                        ? timeConvert(item).toString() + 'h'
                        : takeLabelComplement(item, yComplement ?? '')
            }
        },
        legend: {
            icon: STRAIGHT_LINE_ICON,
            textStyle: { ...COMMON_STYLE }
        },
        tooltip: {
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
            lazyUpdate
            echarts={echarts}
            option={getOption()}
            style={{ width: width ?? '99.9%' }}
            opts={{ renderer: 'canvas', width: 'auto' }}
        />
    )
}

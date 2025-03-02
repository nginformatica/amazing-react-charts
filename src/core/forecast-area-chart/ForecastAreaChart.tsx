import React from 'react'
import type { EChartsOption } from 'echarts-for-react'
import { LineChart as LineChartEcharts } from 'echarts/charts'
import {
    GridComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    MarkLineComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import { take } from 'ramda'
import type {
    ZoomProps,
    TooltipFormatter,
    TooltipEntryProps,
    IDefaultChartProps,
    DataZoomEventProps,
    TDataZoomChartProps,
    SeriesLabelFormatter
} from '../types'
import {
    toDate,
    getDomain,
    formatTime,
    timeConvert,
    getDataView,
    getSaveAsImage,
    takeLabelComplement,
    formatTooltipWithHours
} from '../../lib/auxiliarFunctions'
import {
    TITLE_STYLE,
    COMMON_STYLE,
    AXIS_SPLIT_LINE,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { blue, green, neutral, orange, red } = theme.colors

echarts.use([
    GridComponent,
    TitleComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    LineChartEcharts,
    MarkLineComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent
])

export interface IProps extends Omit<IDefaultChartProps, 'tooltip'> {
    tooltip: {
        current: TooltipEntryProps
        forecast: TooltipEntryProps
    }
    forecastChartLegends?: {
        current?: string
        forecast?: string
        lineMark?: string
    }
}

const ForecastAreaChart = (props: IProps) => {
    const {
        data,
        grid,
        width,
        color,
        title,
        xType,
        yType,
        tooltip,
        yComplement,
        rotateLabel,
        forecastColor,
        lineMarkColor,
        lineMarkValue,
        fontLabelSize,
        toolboxTooltip,
        tooltipComplement,
        forecastChartLegends
    } = props

    const yData = data.map(item => item.result)
    const xData = data.map(item =>
        toDate(item.label, 'yyyy-MM-dd HH:mm').toString()
    )

    const formatLabel = (chartValues: SeriesLabelFormatter) => {
        const { data } = chartValues

        return yType === 'time'
            ? timeConvert(Number(data)).toString()
            : takeLabelComplement(
                  Number(Number(data).toFixed(2)),
                  yComplement ?? ''
              ).toString()
    }

    const dinamicData = (
        item: DataZoomEventProps,
        charts: TDataZoomChartProps
    ) => {
        const dataRange = item.end - item.start
        const dataLimit = 700 / xData.length

        if (dataRange < dataLimit) {
            return charts.setOption({
                series: [
                    {
                        label: {
                            show: true,
                            distance: 1.1,
                            position: 'top',
                            color: neutral[200],
                            formatter: formatLabel,
                            fontSize: yType === 'time' ? 10 : 11.5
                        }
                    }
                ]
            })
        }
        charts.setOption({ series: [{ label: { show: false } }] })
    }

    const formatTooltip = (chartValues: TooltipFormatter[]) => {
        const { current, forecast } = tooltip
        const { axisValueLabel, data } =
            chartValues.length === 2 ? chartValues[1] : chartValues[0]

        const { label, result } = chartValues.length === 2 ? current : forecast
        const complement = tooltipComplement ? tooltipComplement : ''

        const values =
            yType === 'time'
                ? timeConvert(Number(data))
                : takeLabelComplement(
                      Number(Number(data).toFixed(2)),
                      yComplement ?? ''
                  )

        return `${label}: ${formatTooltipWithHours(axisValueLabel)} <br>
      ${result}: ${values} <br>
      ${complement}`
    }

    const zoomEvent = { dataZoom: dinamicData }

    const series = [
        {
            type: 'line',
            data: yData,
            name: forecastChartLegends ? forecastChartLegends.forecast : '',
            label: {
                show: true,
                distance: 1.1,
                position: 'top',
                ...COMMON_STYLE,
                fontSize: yType === 'time' ? 10 : 11.5,
                formatter:
                    typeof yComplement === 'function'
                        ? yComplement.toString()
                        : formatLabel
            },
            lineStyle: { color: forecastColor || orange[600] },
            itemStyle: { color: forecastColor || orange[600] },
            areaStyle: { color: forecastColor || orange[600], opacity: 0 },
            markLine: {
                symbol: '',
                silent: true,
                animation: false,
                data: [
                    {
                        name: forecastChartLegends?.lineMark || 'markLine',
                        xAxis:
                            lineMarkValue && xData[lineMarkValue - 1].toString()
                    }
                ],
                label: {
                    show: true,
                    formatter: forecastChartLegends?.lineMark,
                    color: lineMarkColor || neutral[200]
                },
                lineStyle: {
                    width: 1,
                    type: 'solid',
                    color: lineMarkColor || red[500]
                },
                emphasis: {
                    lineStyle: {
                        width: 50,
                        type: 'solid',
                        color: lineMarkColor || green[800]
                    }
                }
            }
        },
        {
            type: 'line',
            name: forecastChartLegends?.current || '',
            data: lineMarkValue && take(lineMarkValue, yData),
            label: {
                show: false,
                distance: 1.1,
                position: 'top',
                ...COMMON_STYLE,
                fontSize: yType === 'time' ? 10 : 11.5,
                formatter:
                    typeof yComplement === 'function'
                        ? yComplement.toString()
                        : formatLabel
            },
            lineStyle: { color: color || blue[600] },
            itemStyle: { color: color || blue[600] },
            areaStyle: { color: color || blue[600], opacity: 0.2 }
        }
    ]

    const scrollable: ZoomProps[] =
        xData.length > 5
            ? [
                  {
                      type: 'inside',
                      zoomLock: true,
                      endValue: lineMarkValue,
                      zoomOnMouseWheel: 'shift',
                      startValue: lineMarkValue && lineMarkValue - 2
                  },
                  {
                      type: 'slider',
                      bottom: 10,
                      show: true,
                      startValue: lineMarkValue && lineMarkValue - 1,
                      endValue: lineMarkValue && lineMarkValue + 3,
                      labelFormatter: (_: string, item: string) =>
                          formatTime(item, 'dd/MM/yyyy')
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
                    xType === 'time' ? formatTime(item, 'dd MMM') : item
            }
        },
        yAxis: {
            type: 'value',
            max: getDomain,
            splitLine: {
                show: true,
                lineStyle: { ...AXIS_SPLIT_LINE }
            },
            axisTick: { show: true },
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: { color: neutral[200] }
            },
            axisLabel: {
                ...COMMON_STYLE,
                fontSize: fontLabelSize || 11.5,
                margin: yType === 'time' ? 16 : 14,
                formatter: (item: number) =>
                    yType === 'time'
                        ? timeConvert(Number(item)).toString()
                        : takeLabelComplement(
                              Number(item.toFixed(2)),
                              yComplement ?? ''
                          ).toString()
            }
        },
        legend: {
            top: 20,
            itemGap: 30,
            selectedMode: false,
            textStyle: { ...COMMON_STYLE },
            data: [
                forecastChartLegends?.current,
                forecastChartLegends?.forecast
            ]
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
            option={options()}
            style={{ width: '99.9%', height: 300 }}
            opts={{ renderer: 'canvas', width: width ?? 'auto' }}
            onEvents={zoomEvent}
        />
    )
}

export default ForecastAreaChart

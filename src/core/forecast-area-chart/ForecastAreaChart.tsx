import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { take } from 'ramda'
import type {
    IDefaultChartProps,
    TDataZoomChartProps,
    DataZoomEventProps,
    EntryData,
    TooltipEntryProps,
    ZoomProps,
    SeriesLabelFormatter,
    TooltipFormatter
} from '../types'
import type { EChartsOption } from 'echarts/types/dist/echarts'
import {
    formatTime,
    formatTooltipWithHours,
    getDataView,
    getDomain,
    getSaveAsImage,
    timeConvert,
    toDate,
    takeLabelComplement,
    getWidthOpts
} from '../../lib/auxiliarFunctions'
import {
    CHART_HEIGHT,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { blue, gray, green, neutral, orange, red } = theme.colors

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
        xType,
        color,
        forecastColor,
        tooltip: tooltipProps,
        yType,
        tooltipComplement,
        yComplement,
        lineMarkColor,
        lineMarkValue,
        grid: gridProps,
        width,
        rotateLabel,
        fontLabelSize,
        title: titleProps,
        toolboxTooltip,
        forecastChartLegends
    } = props

    const yData = data.map((item: EntryData) => item.result)

    const xData = data.map((item: EntryData) =>
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
                            formatter: formatLabel,
                            show: true,
                            position: 'top',
                            fontSize: yType === 'time' ? 10 : 11.5,
                            color: neutral[200],
                            distance: 1.1
                        }
                    }
                ]
            })
        }
        charts.setOption({ series: [{ label: { show: false } }] })
    }

    const zoomEvent = { dataZoom: dinamicData }

    const formatSingleTooltip = (chartValues: TooltipFormatter[]) => {
        const { current, forecast } = tooltipProps
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

    const toolbox: object | undefined = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        showTitle: false,
        right: '9.52%',
        feature: {
            saveAsImage:
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage.title ?? ''),
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title ?? '')
        }
    }

    const scrollable: ZoomProps[] =
        xData.length > 5
            ? [
                  {
                      type: 'inside',
                      startValue: lineMarkValue && lineMarkValue - 2,
                      endValue: lineMarkValue,
                      zoomLock: true,
                      zoomOnMouseWheel: 'shift'
                  },
                  {
                      bottom: 10,
                      show: true,
                      type: 'slider',
                      startValue: lineMarkValue && lineMarkValue - 1,
                      endValue: lineMarkValue && lineMarkValue + 3,
                      labelFormatter: (_: string, item: string) =>
                          formatTime(item, 'dd/MM/yyyy')
                  }
              ]
            : []

    const options: EChartsOption = {
        // @ts-expect-error fix
        series: [
            {
                type: 'line',
                name: forecastChartLegends ? forecastChartLegends.forecast : '',
                data: yData,
                label: {
                    formatter:
                        typeof yComplement === 'function'
                            ? yComplement.toString()
                            : formatLabel,
                    show: true,
                    position: 'top',
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontSize: yType === 'time' ? 10 : 11.5,
                    fontWeight: 400,
                    color: neutral[200],
                    distance: 1.1
                },
                lineStyle: {
                    color: forecastColor || orange[600]
                },
                areaStyle: {
                    color: forecastColor || orange[600],
                    opacity: 0
                },
                itemStyle: {
                    color: forecastColor || orange[600]
                },
                markLine: {
                    silent: true,
                    symbol: '',
                    label: {
                        formatter: forecastChartLegends?.lineMark,
                        show: true,
                        color: lineMarkColor || neutral[200]
                    },
                    animation: false,
                    data: [
                        {
                            name: forecastChartLegends?.lineMark || 'markLine',
                            xAxis:
                                lineMarkValue &&
                                xData[lineMarkValue - 1].toString()
                        }
                    ],
                    lineStyle: {
                        width: 1,
                        type: 'solid',
                        color: lineMarkColor || red[500]
                    },
                    emphasis: {
                        lineStyle: {
                            type: 'solid',
                            width: 50,
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
                    formatter:
                        typeof yComplement === 'function'
                            ? yComplement.toString()
                            : formatLabel,
                    show: false,
                    position: 'top',
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontSize: yType === 'time' ? 10 : 11.5,
                    fontWeight: 400,
                    color: neutral[200],
                    distance: 1.1
                },
                lineStyle: {
                    color: color || blue[600]
                },
                areaStyle: {
                    color: color || blue[600],
                    opacity: 0.2
                },
                itemStyle: {
                    color: color || blue[600]
                }
            }
        ],
        xAxis: {
            type: 'category',
            data: xData,
            boundaryGap: false,
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.3,
                    color: gray[800]
                }
            },
            axisLabel: {
                formatter: (item: string) =>
                    xType === 'time' ? formatTime(item, 'dd MMM') : item,
                rotate: rotateLabel || 0,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: fontLabelSize || 11.5,
                color: neutral[200]
            }
        },
        yAxis: {
            max: getDomain,
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.3,
                    color: gray[800]
                }
            },
            axisLabel: {
                margin: yType === 'time' ? 16 : 14,
                formatter: (item: number) =>
                    yType === 'time'
                        ? timeConvert(Number(item)).toString()
                        : takeLabelComplement(
                              Number(item.toFixed(2)),
                              yComplement ?? ''
                          ).toString(),
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: fontLabelSize || 11.5,
                color: neutral[200]
            },
            axisTick: {
                // @ts-expect-error issue
                // https://github.com/apache/incubator-echarts/issues/13618
                alignWithLabel: true,
                show: true
            },
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                    color: neutral[200]
                }
            }
        },
        grid: { ...(gridProps || { bottom: 75 }), show: true },
        // @ts-expect-error fix
        legend: {
            top: 20,
            selectedMode: false,
            data: [
                forecastChartLegends?.current,
                forecastChartLegends?.forecast
            ],
            itemGap: 30,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: neutral[200]
            }
        },
        dataZoom: scrollable,
        title: {
            left: '6.2%',
            show: titleProps !== undefined,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: neutral[200]
            }
        },
        tooltip: {
            formatter: formatSingleTooltip,
            trigger: 'axis',
            backgroundColor: `${neutral[200]}99`,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: neutral[50]
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
            lazyUpdate
            notMerge
            style={CHART_HEIGHT}
            opts={getWidthOpts(width || 'auto')}
            option={options}
            onEvents={zoomEvent}
        />
    )
}

export default ForecastAreaChart

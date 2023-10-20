import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
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
    IDefaultChartProps,
    DataTooltip,
    TDataZoomChartProps,
    DataZoomEventProps,
    EntryData,
    OptionsProps,
    TooltipEntryProps,
    ZoomProps
} from '../types'
import { take } from 'ramda'
import { CHART_HEIGHT, TOOLBOX_DEFAULT_PROPS } from '../../commonStyles'

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

    const formatLabel = (chartValues: DataTooltip) => {
        const { data } = chartValues

        return yType === 'time'
            ? timeConvert(Number(data))
            : takeLabelComplement(Number(Number(data).toFixed(2)), yComplement)
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
                            color: 'black',
                            distance: 1.1
                        }
                    }
                ]
            })
        } else {
            charts.setOption({ series: [{ label: { show: false } }] })
        }
    }

    const zoomEvent = { dataZoom: dinamicData }

    const formatSingleTooltip = (
        chartValues: { axisValueLabel: string; data: number }[]
    ) => {
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
                      yComplement
                  )

        return `${label}: ${formatTooltipWithHours(axisValueLabel)} <br>
      ${result}: ${values} <br>
      ${complement}`
    }

    const toolbox = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        showTitle: false,
        right: '9.52%',
        feature: {
            saveAsImage:
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage),
            dataView:
                toolboxTooltip.dataView && getDataView(toolboxTooltip.dataView)
        }
    }

    const scrollable: ZoomProps[] =
        xData.length > 5
            ? [
                  {
                      type: 'inside',
                      startValue: lineMarkValue - 2,
                      endValue: lineMarkValue,
                      zoomLock: true,
                      zoomOnMouseWheel: 'shift'
                  },
                  {
                      bottom: 10,
                      show: true,
                      type: 'slider',
                      startValue: lineMarkValue - 1,
                      endValue: lineMarkValue + 3,
                      labelFormatter: (_: string, item: string) =>
                          formatTime(item, 'dd/MM/yyyy')
                  }
              ]
            : []

    const options = {
        series: [
            {
                type: 'line',
                name: forecastChartLegends ? forecastChartLegends.forecast : '',
                data: yData,
                label: {
                    formatter:
                        typeof yComplement === 'function'
                            ? yComplement
                            : formatLabel,
                    show: true,
                    position: 'top',
                    textStyle: {
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        fontSize: yType === 'time' ? 10 : 11.5,
                        fontWeight: 400 as const,
                        color: 'black'
                    },
                    distance: 1.1
                },
                lineStyle: {
                    color: forecastColor || 'orange'
                },
                areaStyle: {
                    color: forecastColor || 'orange',
                    opacity: 0
                },
                itemStyle: {
                    color: forecastColor || 'orange'
                },
                markLine: {
                    silent: true,
                    symbol: '',
                    label: {
                        formatter: forecastChartLegends.lineMark,
                        show: true,
                        color: lineMarkColor || 'black'
                    },
                    animation: false,
                    data: [
                        {
                            name: forecastChartLegends.lineMark || 'markLine',
                            // @ts-ignore TODO: remove this XGH
                            xAxis: xData[lineMarkValue - 1].toString(),
                            type: 'solid'
                        }
                    ],
                    lineStyle: {
                        width: 1,
                        type: 'solid',
                        color: lineMarkColor || 'red',
                        emphasis: {
                            type: 'solid',
                            width: 50,
                            color: lineMarkColor || 'red'
                        }
                    }
                }
            },
            {
                type: 'line',
                name: forecastChartLegends.current || '',
                data: take(lineMarkValue, yData),
                label: {
                    formatter:
                        typeof yComplement === 'function'
                            ? yComplement
                            : formatLabel,
                    show: false,
                    position: 'top',
                    textStyle: {
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        fontSize: yType === 'time' ? 10 : 11.5,
                        fontWeight: 400 as const,
                        color: 'black'
                    },
                    distance: 1.1
                },
                lineStyle: {
                    color: color || 'blue'
                },
                areaStyle: {
                    color: color || 'blue',
                    opacity: 0.2
                },
                itemStyle: {
                    color: color || 'blue'
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
                    type: 'dashed' as const,
                    opacity: 0.2,
                    color: 'gray'
                }
            },
            axisLabel: {
                formatter: (item: string) =>
                    xType === 'time' ? formatTime(item, 'dd MMM') : item,
                rotate: rotateLabel || 0,
                textStyle: {
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontSize: fontLabelSize || 11.5,
                    color: 'black'
                }
            }
        },
        yAxis: {
            max: getDomain,
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed' as const,
                    opacity: 0.2,
                    color: 'gray'
                }
            },
            axisLabel: {
                margin: yType === 'time' ? 16 : 14,
                formatter: (item: number) =>
                    yType === 'time'
                        ? timeConvert(Number(item))
                        : takeLabelComplement(
                              Number(item.toFixed(2)),
                              yComplement
                          ),
                textStyle: {
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontSize: fontLabelSize || 11.5,
                    color: 'black'
                }
            },
            axisTick: {
                show: true,
                alignWithLabel: true
            },
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                    color: 'black'
                }
            }
        },
        grid: { ...(gridProps || { bottom: 75 }), show: true },
        legend: {
            top: 20,
            selectedMode: false,
            data: [forecastChartLegends.current, forecastChartLegends.forecast],
            itemGap: 30,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: 'black'
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
                fontWeight: 400 as const,
                color: 'black'
            }
        },
        tooltip: tooltipProps && {
            formatter: formatSingleTooltip,
            trigger: 'axis' as const,
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: 'white'
            },
            extraCssText: 'border: none; padding: 6px;'
        },
        toolbox
    }

    return (
        <ReactEcharts
            lazyUpdate
            notMerge
            style={CHART_HEIGHT}
            opts={getWidthOpts(width || 'auto')}
            onEvents={zoomEvent}
            option={options}
        />
    )
}

export default ForecastAreaChart

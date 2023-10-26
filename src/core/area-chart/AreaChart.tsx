import React from 'react'
import { EChartsOption } from 'echarts'
import ReactEcharts from 'echarts-for-react'
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
    IDefaultChartProps,
    TDataZoomChartProps,
    DataZoomEventProps,
    EntryData,
    ZoomProps,
    AreaDataTooltip,
    SeriesLabelFormatter
} from '../types'
import {
    CHART_HEIGHT,
    STRAIGHT_LINE_ICON,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'

const AreaChart = (props: IDefaultChartProps) => {
    const {
        data,
        xType,
        color,
        tooltip: tooltipProps,
        yType,
        lineMarkValue = 0,
        lineMarkColor = '',
        lineMakeName = '',
        tooltipComplement,
        yComplement,
        dateFormat,
        grid: gridProps,
        width,
        rotateLabel,
        fontLabelSize,
        title: titleProps,
        toolboxTooltip,
        scrollStart
    } = props

    const markLine = lineMarkValue && data.map(() => lineMarkValue)

    const yData = data.map((item: EntryData) => item.result)

    const xData = data.map((item: EntryData) => item.label)

    const WIDTH_OPTS = { width: width || 'auto' }

    const formatLabel = (chartValues: SeriesLabelFormatter) => {
        const { data } = chartValues

        return yType === 'time'
            ? timeConvert(Number(data as number)).toString() + 'h'
            : takeLabelComplement(Number(data), yComplement).toString()
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

    const formatSingleTooltip = (chartValues: AreaDataTooltip[]) => {
        const { label, result } = tooltipProps
        const { axisValueLabel, data } = chartValues[0]
        const complement = tooltipComplement ? tooltipComplement : ''

        const values =
            yType === 'time'
                ? timeConvert(Number(data as number)) + 'h'
                : takeLabelComplement(Number(data), yComplement)

        return `${label}: ${formatTooltip(axisValueLabel, dateFormat)} <br>
      ${result}: ${values} <br> 
      ${complement}`
    }

    const toolbox: object = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        feature: {
            saveAsImage:
                toolboxTooltip &&
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage.title),
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title)
        }
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
                      start: getInitialValues(
                          xData.length,
                          dateFormat,
                          scrollStart
                      ),
                      end: 100,
                      zoomLock: true,
                      zoomOnMouseWheel: 'shift'
                  },
                  {
                      bottom: 10,
                      show: true,
                      type: 'slider',
                      start: getInitialValues(
                          xData.length,
                          dateFormat,
                          scrollStart
                      ),
                      end: 100,
                      labelFormatter: (_: string, item: string) =>
                          formatTime(item, tooltipLabelFormat)
                  }
              ]
            : []

    const options: EChartsOption = {
        series: [
            {
                type: 'line',
                data: yData,
                label: {
                    formatter: (item: SeriesLabelFormatter) => {
                        if (
                            typeof yComplement === 'function' &&
                            typeof item === 'object'
                        ) {
                            return yComplement(item.data)
                        }

                        typeof yComplement === 'function'
                            ? yComplement
                            : formatLabel
                    },
                    show: true,
                    position: 'top',
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontSize: yType === 'time' ? 10 : 11.5,
                    color: 'black',
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
                    color: color
                }
            },
            {
                name: lineMakeName,
                symbolSize: 0,
                showSymbol: false,
                type: 'line',
                data: markLine,
                lineStyle: {
                    color: lineMarkColor
                },
                emphasis: {
                    scale: false
                }
            }
        ],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xData as string[],
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.2,
                    color: 'gray'
                }
            },
            axisLabel: {
                formatter: (item: string) =>
                    xType === 'time'
                        ? formatTime(item, getDateFormatType(dateFormat))
                        : item,
                rotate: rotateLabel || 0,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: fontLabelSize || 11.5,
                color: 'black'
            }
        },
        yAxis: {
            max: lineMarkValue ? fixedDomain : getDomain,
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.2,
                    color: 'gray'
                }
            },
            axisLabel: {
                margin: yType === 'time' ? 16 : 14,
                formatter: (item: number) =>
                    yType === 'time'
                        ? timeConvert(item) + 'h'
                        : takeLabelComplement(item, yComplement).toString(),
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: fontLabelSize || 11.5,
                color: 'black'
            },
            axisLine: {
                show: true
            },
            axisTick: {
                // @ts-ignore
                // https://github.com/apache/incubator-echarts/issues/13618
                alignWithLabel: true,
                show: true
            }
        },
        color: [lineMarkColor],
        grid: { ...(gridProps || { bottom: 75 }), show: true },
        legend: {
            icon: STRAIGHT_LINE_ICON,
            top: 30,
            data: [lineMakeName],
            itemGap: 30,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: 'black'
            }
        },
        title: {
            left: '6.2%',
            show: titleProps !== undefined,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: 'black'
            }
        },
        tooltip: tooltipProps && {
            formatter: formatSingleTooltip,
            trigger: 'axis',
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: 'white'
            },
            extraCssText: 'border: none; padding: 6px;'
        },
        dataZoom: scrollable,
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
            opts={WIDTH_OPTS}
            onEvents={zoomEvent}
            option={options}
        />
    )
}

export default AreaChart

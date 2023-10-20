import * as React from 'react'
import ReactCharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    EntryData,
    EntryDataLine,
    ZoomProps
} from '../types'
import {
    formatTime,
    getDataView,
    getDateFormatType,
    getInitialValues,
    getSaveAsImage,
    getWidthOpts,
    takeLabelComplement,
    timeConvert
} from '../../lib/auxiliarFunctions'
import { CHART_WIDTH, TOOLBOX_DEFAULT_PROPS } from '../../commonStyles'

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: EntryDataLine[]
    colors?: string[]
    showLabel?: boolean
    smooth?: boolean
    disableMarks?: boolean
    noTooltip?: boolean
    axisNames?: { x: string; y: string }
}

const STRAIGHT_LINE = 'path://M0 0H25H50V2H25H0V0Z'

const takeYdata = (entryData: EntryData[]) => entryData.map(item => item.result)

const LineChart = (props: IProps) => {
    const {
        data,
        width,
        grid: gridProps,
        colors,
        xType,
        dateFormat,
        rotateLabel,
        fontLabelSize,
        yType,
        yComplement,
        title: titleProps,
        toolboxTooltip,
        showLabel,
        smooth,
        disableMarks,
        noTooltip,
        scrollStart
    } = props

    const yData = data[0].values.map(item => item.result)

    const xData = data[0].values.map(item => item.label)

    const names = data.map(item => item.name)

    const formatLabel = (chartValues: { data: number }) => {
        const { data } = chartValues

        return yType === 'time'
            ? timeConvert(Number(data as number)) + 'h'
            : takeLabelComplement(Number(data), yComplement)
    }

    const series = data.map(item => ({
        name: item.name,
        type: 'line' as const,
        data: takeYdata(item.values),
        showSymbol: !disableMarks,
        lineStyle: {
            width: 1.5,
            type: item.name === 'ref' ? ('dashed' as const) : undefined
        },
        smooth: smooth,
        label: {
            show: showLabel,
            position: 'top',
            fontSize: yType === 'time' ? 10 : 11.5,
            color: 'black',
            distance: 1.1,
            formatter: (item: number | string | { data: number }) => {
                if (
                    typeof yComplement === 'function' &&
                    typeof item === 'object'
                ) {
                    return yComplement(item.data)
                }

                typeof yComplement === 'function' ? yComplement : formatLabel
            }
        }
    }))

    const arrayInitialSize = scrollStart || (dateFormat === 'yyyy-MM' ? 12 : 30)

    const tooltipLabelFormat =
        dateFormat === 'yyyy-MM' ? 'MMM/yy' : 'dd/MM/yyyy'

    const scrollable: ZoomProps[] =
        xData.length > arrayInitialSize
            ? [
                  {
                      type: 'inside' as const,
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
                      type: 'slider' as const,
                      start: getInitialValues(
                          xData.length,
                          dateFormat,
                          scrollStart
                      ),
                      end: 100,
                      labelFormatter: (_: string, item2: string) =>
                          formatTime(item2, tooltipLabelFormat)
                  }
              ]
            : []

    const formatTooltip = (
        lines: { name: string; seriesName: string; value: number }[]
    ) => {
        const takeComplement = (value: number) =>
            yType === 'time'
                ? timeConvert(Number(value)) + 'h'
                : takeLabelComplement(Number(value), yComplement)

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
                      getDateFormatType(dateFormat)
                  )
                : lines[0].name

        return `${tooltipTitle} <br> ${linesTooltips.join(' ')}`
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

    const options = {
        color: colors,
        series: series,
        xAxis: {
            type: 'category' as const,
            data: xData,
            boundaryGap: false,
            showGrid: true,
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
                    xType === 'time'
                        ? formatTime(
                              dateFormat === 'yyyy-MM' ? item + '-02' : item,
                              getDateFormatType(dateFormat)
                          )
                        : item,
                rotate: rotateLabel || 0,
                textStyle: {
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: 400 as const,
                    fontSize: fontLabelSize || 11.5,
                    color: 'black'
                }
            }
        },
        yAxis: {
            type: 'value' as const,
            data: yData,
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
                        ? timeConvert(item) + 'h'
                        : takeLabelComplement(item, yComplement),
                textStyle: {
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: 400 as const,
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
                lineStyle: {
                    color: 'black'
                }
            }
        },
        grid: { ...(gridProps || { bottom: 75 }), show: true },
        legend: {
            data: names,
            icon: STRAIGHT_LINE,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400 as const,
                color: 'black'
            }
        },
        tooltip: !noTooltip && {
            formatter: formatTooltip,
            trigger: 'axis' as const,
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: 'white'
            },
            extraCssText: 'border: none; padding: 6px;'
        },
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
        dataZoom: scrollable,
        toolbox
    }

    return (
        <ReactCharts
            lazyUpdate
            notMerge
            style={CHART_WIDTH}
            opts={getWidthOpts(width || 'auto')}
            option={options}
        />
    )
}

export default LineChart

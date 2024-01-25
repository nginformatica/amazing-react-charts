import * as React from 'react'
import ReactCharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import type {
    IDefaultChartProps,
    EntryData,
    EntryDataLine,
    ZoomProps,
    LinesFormatterTooltip
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
import {
    CHART_WIDTH,
    STRAIGHT_LINE_ICON,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: EntryDataLine[]
    colors?: string[]
    showLabel?: boolean
    smooth?: boolean
    disableMarks?: boolean
    noTooltip?: boolean
    axisNames?: { x: string; y: string }
}

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

    const series: object = data.map(item => ({
        type: 'line',
        name: item.name,
        data: takeYdata(item.values),
        showSymbol: !disableMarks,
        lineStyle: {
            width: 1.5,
            type: item.name === 'ref' ? 'dashed' : undefined
        },
        smooth: smooth,
        label: {
            show: showLabel,
            position: 'top',
            fontSize: yType === 'time' ? 10 : 11.5,
            color: '#000000',
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
                      labelFormatter: (_: string, item2: string) =>
                          formatTime(item2, tooltipLabelFormat)
                  }
              ]
            : []

    const formatTooltip = (lines: LinesFormatterTooltip[]) => {
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

    const toolbox: object = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        showTitle: false,
        right: '9.52%',
        feature: {
            saveAsImage:
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage.title),
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title)
        }
    }

    const options: EChartsOption = {
        color: colors,
        series: series,
        xAxis: {
            type: 'category',
            data: xData,
            boundaryGap: false,
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
                        ? formatTime(
                              dateFormat === 'yyyy-MM' ? item + '-02' : item,
                              getDateFormatType(dateFormat)
                          )
                        : item,
                rotate: rotateLabel || 0,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400,
                fontSize: fontLabelSize || 11.5,
                color: '#000000'
            }
        },
        yAxis: {
            type: 'value',
            data: yData,
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
                        ? timeConvert(item).toString() + 'h'
                        : takeLabelComplement(item, yComplement).toString(),
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400,
                fontSize: fontLabelSize || 11.5,
                color: '#000000'
            },
            axisTick: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // https://github.com/apache/incubator-echarts/issues/13618
                alignWithLabel: true,
                show: true
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#000000'
                }
            }
        },
        grid: { ...(gridProps || { bottom: 75 }), show: true },
        legend: {
            data: names,
            icon: STRAIGHT_LINE_ICON,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400,
                color: '#000000'
            }
        },
        tooltip: !noTooltip && {
            formatter: formatTooltip,
            trigger: 'axis',
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: '#FFFFFF'
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
                fontWeight: 400,
                color: '#000000'
            }
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

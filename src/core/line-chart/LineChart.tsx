import React from 'react'
import ReactCharts from 'echarts-for-react'
import type {
    IDefaultChartProps,
    EntryData,
    EntryDataLine,
    ZoomProps,
    LinesFormatterTooltip
} from '../types'
import type { EChartsOption } from 'echarts/types/dist/echarts'
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
import { theme } from 'flipper-ui/theme'

const { gray, neutral } = theme.colors

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: EntryDataLine[]
    colors?: string[]
    showLabel?: boolean
    smooth?: boolean
    disableMarks?: boolean
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
        scrollStart
    } = props

    const yData = data[0].values.map(item => item.result)

    const xData = data[0].values.map(item => item.label)

    const names = data.map(item => item.name)

    const formatLabel = (chartValues: { data: number }) => {
        const { data } = chartValues

        return yType === 'time'
            ? timeConvert(Number(data as number)) + 'h'
            : takeLabelComplement(Number(data), yComplement ?? '')
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
            color: neutral[200],
            distance: 1.1,
            formatter: (item: number | string | { data: number }) => {
                if (
                    typeof yComplement === 'function' &&
                    typeof item === 'object'
                ) {
                    return yComplement(item.data)
                }

                if (typeof yComplement === 'function') {
                    return yComplement
                }

                // this can't be returned
                // it breaks the labels
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                formatLabel
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
                    color: gray[800]
                }
            },
            axisLabel: {
                formatter: (item: string) =>
                    xType === 'time'
                        ? formatTime(
                              dateFormat === 'yyyy-MM' ? item + '-02' : item,
                              getDateFormatType(dateFormat ?? 'yyyy-MM')
                          )
                        : item,
                rotate: rotateLabel || 0,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400,
                fontSize: fontLabelSize || 11.5,
                color: neutral[200]
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
                    color: gray[800]
                }
            },
            axisLabel: {
                margin: yType === 'time' ? 16 : 14,
                formatter: (item: number) =>
                    yType === 'time'
                        ? timeConvert(item).toString() + 'h'
                        : takeLabelComplement(
                              item,
                              yComplement ?? ''
                          ).toString(),
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400,
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
                lineStyle: {
                    color: neutral[200]
                }
            }
        },
        grid: { ...(gridProps || { bottom: 75 }), show: true },
        // @ts-expect-error issue
        legend: {
            data: names,
            icon: STRAIGHT_LINE_ICON,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400,
                color: neutral[200]
            }
        },
        tooltip: {
            formatter: formatTooltip,
            trigger: 'axis',
            backgroundColor: `${neutral[200]}99`,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: neutral[50]
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
                color: neutral[200]
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

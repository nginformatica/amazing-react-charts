import * as React from 'react'
import { EChartsOption } from 'echarts'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TDataZoomChartProps,
    DataZoomEventProps,
    EntryData,
    LabelProps,
    ZoomProps,
    VerticalBarLabelFormatter,
    EChartSeries,
    TooltipFormatter
} from '../types'
import {
    formatTime,
    formatTooltip,
    getDataView,
    getDomain,
    getSaveAsImage,
    timeConvert,
    fixedTruncateLabel,
    takeLabelComplement,
    getWidthOpts,
    getDateFormatType,
    getInitialValues
} from '../../lib/auxiliarFunctions'
import { CHART_WIDTH, TOOLTIP_DEFAULT_PROPS } from '../../commonStyles'

export interface IProps extends IDefaultChartProps {
    rotateTickLabel?: number
    customMaxDomain?: number
    interval?: number
}

export const fullText = {
    xAxis: {
        axisLabel: {
            rotate: 0,
            show: true,
            interval: 0,
            formatter: (item: string) => fixedTruncateLabel(item, 16)
        }
    },
    grid: { bottom: 75 }
}

export const rotatedLabel = {
    xAxis: {
        axisLabel: {
            rotate: 315,
            show: true,
            interval: 0,
            formatter: (item: string) => fixedTruncateLabel(item, 9)
        }
    },
    grid: { bottom: 98 }
}

const rotatedLabelSpecial = (rotate: number) => ({
    xAxis: {
        axisLabel: {
            rotate: rotate,
            show: true,
            interval: 0,
            formatter: (item: string) => fixedTruncateLabel(item, 9),
            textStyle: {
                fontSize: 11
            }
        }
    },
    grid: { bottom: 98 }
})

export const normalLabel = {
    xAxis: {
        axisLabel: {
            rotate: 0,
            show: true,
            interval: 0,
            formatter: (item: string) => fixedTruncateLabel(item, 9)
        }
    },
    grid: { bottom: 75 }
}

export const dontShowLabel = {
    xAxis: {
        axisLabel: {
            interval: 1,
            rotate: 0
        }
    },
    grid: { bottom: 75 }
}

const VerticalBarChart = (props: IProps) => {
    const {
        data,
        color,
        xType,
        yComplement,
        yType,
        tooltip: tooltipProps,
        tooltipComplement,
        barWidth,
        dateFormat,
        grid: gridProps,
        width,
        showBarLabel,
        title: titleProps,
        toolboxTooltip,
        isMoreThanHundredPercent,
        marginLeftTitle,
        titleFontSize,
        rotateLabel,
        onClickBar,
        marginRightToolbox,
        customMaxDomain,
        interval,
        scrollStart
    } = props

    const isCustomDomain = customMaxDomain ? customMaxDomain : getDomain

    const yData: EChartSeries = data.map((item: EntryData) => {
        const results = data.map(item => item.result)
        const maxValue = Math.max(...results)

        const label: LabelProps = showBarLabel &&
            item.result <= 10 && {
                position: 'top',
                distance: 1
            }

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

    const xData = data.map((item: EntryData) => item.label)

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
            : String(takeLabelComplement(Number(value), yComplement))
    }

    const toolbox: object = toolboxTooltip && {
        showTitle: false,
        right: marginRightToolbox || '8.7%',
        feature: {
            saveAsImage:
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage.title),
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title)
        }
    }

    const formatSingleTooltip = (chartValues: TooltipFormatter[]) => {
        const { label, result } = tooltipProps
        const { axisValueLabel, value } = chartValues[0]
        const complement = tooltipComplement ? tooltipComplement : ''
        const values =
            yType === 'time'
                ? timeConvert(Number(value)) + 'h'
                : takeLabelComplement(Number(value), yComplement)

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

    const options: EChartsOption = {
        grid: { ...gridProps },
        color: [color],
        interval,
        series: [
            {
                barWidth: barWidth || 'auto',
                type: 'bar',
                data: yData,
                label: {
                    formatter: formatLabel,
                    show: showBarLabel,
                    position: 'insideTop',
                    distance: 6,
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: 400 as const,
                    fontSize: 12,
                    color: '#000000'
                }
            }
        ],
        xAxis: {
            type: 'category',
            boundaryGap: true,
            showGrid: true,
            data: xData as string[],
            splitLine: {
                show: true,
                // @ts-ignore
                // https://github.com/apache/incubator-echarts/issues/13618
                alignWithLabel: true,
                lineStyle: {
                    type: 'dashed' as const,
                    opacity: 0.2,
                    color: 'gray'
                }
            },
            axisLabel: {
                rotate: rotateLabel && rotateLabel,
                formatter: (item: string) =>
                    xType === 'time'
                        ? formatTime(
                              item,
                              getDateFormatType(dateFormat, 'dd/MM/yyyy')
                          )
                        : specialLabel(item),
                interval: 0,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400 as const,
                fontSize: 11,
                color: '#000000'
            },
            axisTick: {
                show: true,
                alignWithLabel: true
            }
        },
        yAxis: {
            max:
                !isMoreThanHundredPercent && yComplement === '%'
                    ? 100
                    : isCustomDomain,
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
                formatter: (item: number) =>
                    yType === 'time'
                        ? timeConvert(item) + 'h'
                        : String(takeLabelComplement(item, yComplement)),
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400 as const,
                fontSize: 11,
                color: '#000000'
            },
            axisLine: {
                show: true
            },
            axisTick: {
                show: true,
                // @ts-ignore
                // https://github.com/apache/incubator-echarts/issues/13618
                alignWithLabel: true
            }
        },
        title: {
            left: marginLeftTitle || '5.9%',
            show: titleProps !== undefined,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: titleFontSize || 16,
                fontWeight: 400 as const,
                color: '#000000'
            }
        },
        tooltip: tooltipProps && {
            formatter: formatSingleTooltip,
            trigger: 'axis',
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: '#FFFFFF'
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

    const events = { dataZoom: dynamicDataZoom, click: onClickBar }

    return (
        <ReactEcharts
            lazyUpdate
            notMerge
            style={CHART_WIDTH}
            opts={getWidthOpts(width || 'auto')}
            onEvents={events}
            option={options}
        />
    )
}

export default VerticalBarChart

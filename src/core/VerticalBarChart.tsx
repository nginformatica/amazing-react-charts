import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TDataTooltip,
    TDataZoomChartProps,
    TDataZoomEventProps,
    TEntryData,
    TLabelProps,
    TOptionsProps,
    TSaveAsImage,
    TTitleProps,
    TTooltipProps,
    TZoomProps
} from './types'
import {
    formatTime,
    formatTooltip,
    getDataView,
    getDomain,
    getSaveAsImage,
    timeConvert,
    toDate,
    truncateLabel
} from './auxiliarFunctions'

export const fullText = {
    xAxis: {
        axisLabel: {
            rotate: 0,
            show: true,
            interval: 0,
            formatter: (item: string) => item
        }
    },
    grid: { bottom: 60 }
}

export const rotatedLabel = {
    xAxis: {
        axisLabel: {
            rotate: 30,
            show: true,
            interval: 0,
            formatter: truncateLabel
        }
    },
    grid: { bottom: '29%' }
}

export const normalLabel = {
    xAxis: {
        axisLabel: {
            rotate: 0,
            show: true,
            interval: 0,
            formatter: truncateLabel
        }
    },
    grid: { bottom: 60 }
}

export const dontShowLabel = {
    xAxis: {
        axisLabel: {
            rotate: 0,
            interval: 'auto',
            formatter: (item: string) => item
        }
    },
    grid: { bottom: 60 }
}

interface IProps extends IDefaultChartProps {
    rotateTickLabel?: number
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
        marginRightToolbox
    } = props

    const yData = data.map((item: TEntryData) => {
        const label: TLabelProps = (showBarLabel && item.result <= 10) && {
            position: 'top',
            distance: 1
        }

        return ({
            value: item.result,
            label: label,
            itemId: item.itemId && item.itemId
        })
    })

    const xData = xType === 'time'
        ? data.map((item: TEntryData) => toDate(item.label, dateFormat))
        : data.map((item: TEntryData) => item.label)

    const dynamicDataZoom = (
        item: TDataZoomEventProps,
        charts: TDataZoomChartProps
    ) => {

        if (!rotateLabel) {
            const dataRange = item.end - item.start
            const dataLimit = 1200 / xData.length
            const fullLabel = 500 / xData.length

            if (xData.length <= 5 || dataRange < fullLabel) {
                charts.setOption(fullText)
            } else if (xData.length <= 14 || dataRange < dataLimit) {
                charts.setOption(normalLabel)
            } else if (dataRange < 40) {
                charts.setOption(rotatedLabel)
            } else {
                charts.setOption(dontShowLabel)
            }
        }
    }

    const formatLabel = (chartValues: TDataTooltip) => {
        const { value } = chartValues

        return (yComplement
            ? value + yComplement
            : yType === 'time'
                ? timeConvert(Number(value)) + 'h'
                : value
        )
    }

    const title: TTitleProps = {
        id: 'chart-' + titleProps,
        left: marginLeftTitle || '5.9%',
        show: titleProps !== undefined,
        text: titleProps,
        textAlign: 'left',
        textStyle: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: titleFontSize || 16,
            fontWeight: 400
        }
    }

    const toolbox = toolboxTooltip && (
        {
            showTitle: false,
            right: marginRightToolbox || '8.7%',
            feature: {
                saveAsImage: toolboxTooltip.saveAsImage && (
                    getSaveAsImage(toolboxTooltip.saveAsImage) as TSaveAsImage
                ),
                dataView: toolboxTooltip.dataView && (
                    getDataView(toolboxTooltip.dataView)
                )
            },
            tooltip: {
                show: true,
                backgroundColor: 'grey',
                textStyle: {
                    fontSize: 12
                }
            }
        }
    )

    const formatSingleTooltip = (chartValues: TDataTooltip[]) => {
        const { label, result } = tooltipProps
        const { axisValueLabel, value } = chartValues[0]
        const complement = tooltipComplement ? tooltipComplement : ''
        const values = yType === 'time'
            ? timeConvert(value as number) + 'h'
            : value + (yComplement || '')

        const labelPrint = xType === 'time'
            ? formatTooltip(axisValueLabel)
            : axisValueLabel

        return [
            `${label}: ${labelPrint} <br>` +
            `${result}: ${values} <br>` +
            complement
        ]
    }

    const tooltip: TTooltipProps = {
        formatter: formatSingleTooltip,
        trigger: 'axis',
        textStyle: { fontSize: 11.5 }
    }

    const scrollable: TZoomProps[] = data.length > 12
        ? [
            {
                type: 'inside',
                endValue: xData.length > 12 ? xData[11] : xData[xData.length - 1],
                zoomOnMouseWheel: 'shift'
            }, {
                show: true,
                type: 'slider',
                endValue: xData.length > 12 ? xData[11] : xData[xData.length - 1]
            }
        ]
        : []

    const options: TOptionsProps = {
        grid: gridProps,
        color: [color],
        series: [{
            barWidth: barWidth || 'auto',
            type: 'bar',
            data: yData,
            label: {
                formatter: formatLabel,
                show: showBarLabel,
                position: 'insideTop',
                fontSize: 14,
                color: 'black',
                distance: 6
            }
        }],
        xAxis: {
            type: 'category',
            boundaryGap: true,
            showGrid: true,
            data: xData,
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    opacity: 0.8
                },
                alignWithLabel: true
            },
            axisLabel: {
                rotate: rotateLabel && rotateLabel,
                formatter:
                    (item: string) => xType === 'time'
                        ? formatTime(item, 'dd MMM')
                        : truncateLabel(item, rotateLabel && 7),
                interval: 0,
                textStyle: {
                    fontSize: 11.5
                }
            },
            axisTick: {
                show: true,
                alignWithLabel: true
            }
        },
        yAxis: {
            max: !isMoreThanHundredPercent && yComplement === '%'
                ? 100
                : getDomain,
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    opacity: 0.8
                }
            },
            axisLabel: {
                formatter:
                    (item: number) => yType === 'time'
                        ? timeConvert(item) + 'h'
                        : item + (yComplement || ''),
                textStyle: {
                    fontSize: 11.5
                }
            }
        },
        dataZoom: scrollable,
        title,
        toolbox
    }

    return (
        <ReactEcharts
            lazyUpdate
            notMerge
            style={ { width: '99%' } }
            opts={ { width: width } }
            onEvents={ {
                dataZoom: dynamicDataZoom,
                click: onClickBar
            } }
            option={
                tooltipProps
                    ? { ...options, tooltip }
                    : options
            }
        />
    )
}

export default VerticalBarChart

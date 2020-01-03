import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    fixedDomain,
    formatTime,
    formatTooltip,
    getDataView,
    getDomain,
    getSaveAsImage,
    timeConvert,
    toDate
} from './auxiliarFunctions'
import {
    IDefaultChartProps,
    TDataTooltip,
    TEntryData,
    TOptionsProps,
    TSaveAsImage,
    TTitleProps,
    TTooltipProps,
    TZoomProps
} from './types'

const AreaChart = (props: IDefaultChartProps) => {
    const {
        data,
        xType,
        color,
        tooltip: tooltipProps,
        yType,
        lineMarkValue,
        lineMarkColor,
        lineMakeName,
        tooltipComplement,
        yComplement,
        dateFormat,
        grid: gridProps,
        width,
        rotateLabel,
        fontLabelSize,
        title: titleProps,
        toolboxTooltip
    } = props

    const markLine = lineMarkValue && data.map(() => lineMarkValue)
    const yData = data.map((item: TEntryData) => item.result)
    const xData = xType === 'time'
        ? data.map((item: TEntryData) => toDate(item.label, dateFormat))
        : data.map((item: TEntryData) => item.label)

    const formatLabel = (chartValues: TDataTooltip) => {
        const { data } = chartValues

        return yComplement
            ? Number(data).toFixed(2) + yComplement
            : yType === 'time'
                ? timeConvert(Number(data))
                : data
    }

    const formatSingleTooltip = (chartValues: TDataTooltip[]) => {
        const { label, result } = tooltipProps
        const { axisValueLabel, data } = chartValues[0]
        const complement = tooltipComplement ? tooltipComplement : ''
        const values = yType === 'time'
            ? timeConvert(data as number) + 'h'
            : data + (yComplement || '')

        return [
            `${label}: ${formatTooltip(axisValueLabel, dateFormat)} <br>` +
            `${result}: ${values} <br>` +
            complement
        ]
    }

    const tooltip: TTooltipProps = {
        formatter: formatSingleTooltip,
        trigger: 'axis',
        textStyle: { fontSize: 11.5 }
    }

    const title: TTitleProps = {
        id: 'chart-' + titleProps,
        show: titleProps !== undefined,
        text: titleProps,
        textStyle: {
            fontFamily: 'roboto',
            fontSize: 16,
            fontWeight: 400
        }
    }

    const toolbox = toolboxTooltip && (
        {
            showTitle: false,
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

    const scrollable: TZoomProps[] = xData.length > 20
        ? [
            {
                type: 'inside',
                endValue: xData.length > 20 ? xData[17] : xData[xData.length - 1]
            }, {
                bottom: 250,
                show: true,
                type: 'slider',
                endValue: xData.length > 20 ? xData[17] : xData[xData.length - 1],
                labelFormatter:
                    (_: string, item2: string) => formatTime(item2, 'dd/MM/yyyy')
            }
        ]
        : []

    const options: TOptionsProps = {
        series: [{
            type: 'line',
            data: yData,
            label: {
                formatter: formatLabel,
                show: true,
                position: 'top',
                fontSize: fontLabelSize || 11.5,
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
            hoverAnimation: false,
            type: 'line',
            data: markLine,
            lineStyle: {
                color: lineMarkColor
            }
        }
        ],

        xAxis: {
            type: 'category',
            boundaryGap: false,
            showGrid: true,
            data: xData,
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    opacity: 0.8
                }
            },
            axisLabel: {
                formatter:
                    (item: string) => xType === 'time'
                        ? formatTime(
                            item,
                            dateFormat === 'yyyy-MM' ? 'MMM/yy' : 'dd MMM'
                        )
                        : item,
                rotate: rotateLabel || 0,
                interval: 'auto',
                textStyle: {
                    fontSize: fontLabelSize || 11.5
                }
            }
        },
        yAxis: {
            max: lineMarkValue ? fixedDomain : getDomain,
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dotted',
                    opacity: 0.8
                }
            },
            axisLabel: {
                margin: yType === 'time' ? 16 : 14,
                formatter:
                    (item: number) => yType === 'time'
                        ? timeConvert(item) + 'h'
                        : item + (yComplement || ''),
                textStyle: {
                    fontSize: fontLabelSize || 11.5
                }
            }
        },
        grid: { ...gridProps, show: true },
        legend: {
            x: 'center',
            y: 'bottom',
            icon: 'line',
            top: 260,
            data: [lineMakeName],
            itemGap: 30
        },
        dataZoom: scrollable,
        title: title,
        toolbox
    }

    return (
        <ReactEcharts
            notMerge
            style={ { width: '99%' } }
            opts={ { width: width } }
            option={
                tooltipProps
                    ? { ...options, tooltip }
                    : options
            }
        />
    )
}

export default AreaChart

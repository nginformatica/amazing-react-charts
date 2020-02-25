import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    fixedDomain,
    formatMoneyLabel,
    formatTime,
    formatTooltip,
    getDataView,
    getDomain,
    getInitialValues,
    getSaveAsImage,
    timeConvert,
    toDate
} from './auxiliarFunctions'
import {
    IDefaultChartProps,
    TDataTooltip,
    TDataZoomChartProps,
    TDataZoomEventProps,
    TEntryData,
    TOptionsProps,
    TSaveAsImage,
    TTitleProps,
    TTooltipProps,
    TZoomProps
} from './types'
import { formatToBRL } from 'brazilian-values'

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
                : yComplement === 'money' ? formatToBRL(data) : data
    }

    const dinamicData = (
        item: TDataZoomEventProps,
        charts: TDataZoomChartProps
    ) => {
        const dataRange = item.end - item.start
        const dataLimit = (yType === 'time' ? 3400 : 4500) / xData.length

        if (xData.length <= 30 || dataRange < dataLimit) {
            return charts.setOption({
                series: [{
                    label: {
                        formatter: formatLabel,
                        show: true,
                        position: 'top',
                        fontSize: yType === 'time' ? 10 : 11.5,
                        color: 'black',
                        distance: 1.1
                    }
                }]
            }
            )
        } else {
            charts.setOption({ series: [{ label: { show: false } }] })
        }
    }

    const formatSingleTooltip = (chartValues: TDataTooltip[]) => {
        const { label, result } = tooltipProps
        const { axisValueLabel, data } = chartValues[0]
        const complement = tooltipComplement ? tooltipComplement : ''
        const values = yType === 'time'
            ? timeConvert(Number(data as number)) + 'h'
            : yComplement === 'money'
                ? formatToBRL(Number(data))
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
        left: '6.2%',
        show: titleProps !== undefined,
        text: titleProps,
        textAlign: 'left',
        textStyle: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 16,
            fontWeight: 400
        }
    }

    const toolbox = toolboxTooltip && (
        {
            showTitle: false,
            right: '9.52%',
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

    const aaa = dateFormat === 'yyyy-MM' ? 12 : 30

    const scrollable: TZoomProps[] = xData.length > aaa
        ? [
            {
                type: 'inside',
                start: getInitialValues(xData.length, dateFormat),
                end: 100,
                zoomLock: true,
                zoomOnMouseWheel: 'shift'
            },
            {
                bottom: 0,
                show: true,
                type: 'slider',
                start: getInitialValues(xData.length, dateFormat),
                end: 100,
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
                formatter: yComplement === 'money' ? formatMoneyLabel : formatLabel,
                show: true,
                position: 'top',
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
                        : yComplement === 'money'
                            ? formatToBRL(item)
                            : item + (yComplement || ''),
                textStyle: {
                    fontSize: fontLabelSize || 11.5
                }
            }
        },
        color: [lineMarkColor],
        grid: { ...gridProps || { bottom: 60 }, show: true },
        legend: {
            x: 'center',
            y: 'bottom',
            icon: 'line',
            top: 30,
            data: [lineMakeName],
            itemGap: 30
        },
        dataZoom: scrollable,
        title: title,
        toolbox
    }

    return (
        <ReactEcharts
            lazyUpdate
            notMerge
            style={ { width: '99.9%', height: 300 } }
            opts={ { width: width || 'auto' } }
            onEvents={ { dataZoom: dinamicData } }
            option={
                tooltipProps
                    ? { ...options, tooltip }
                    : options
            }
        />
    )
}

export default AreaChart

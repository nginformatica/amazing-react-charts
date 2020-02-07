import * as React from 'react'
import ReactCharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TDataTooltip,
    TEntryData,
    TEntryDataLine,
    TOptionsProps,
    TSaveAsImage,
    TSeries,
    TTitleProps,
    TTooltipProps,
    TZoomProps
} from './types'
import {
    formatTime,
    getDataView,
    getSaveAsImage,
    timeConvert
} from './auxiliarFunctions'

interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: TEntryDataLine[]
    colors?: string[]
    showLabel?: boolean
}

const takeYdata = (entryData: TEntryData[]) =>
    entryData.map(item => item.result)

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
        showLabel
    } = props

    const yData = data[0].values.map(item => item.result)
    const xData = data[0].values.map(item => item.label)
    const names = data.map(item => item.name)

    const series: TSeries[] = data.map(item => ({
        name: item.name,
        type: 'line',
        data: takeYdata(item.values),
        label: {
            show: showLabel,
            position: 'top',
            fontSize: yType === 'time' ? 10 : 11.5,
            color: 'black',
            distance: 1.1
        }
    }))

    const scrollable: TZoomProps[] = xData.length > 30
        ? [
            {
                type: 'inside',
                start: xData.length > 30 ? (100 - (3000 / xData.length)) : 0,
                end: 100,
                zoomLock: true,
                zoomOnMouseWheel: 'shift'
            },
            {
                bottom: 0,
                show: true,
                type: 'slider',
                start: xData.length > 30 ? (100 - (3000 / xData.length)) : 0,
                end: 100,
                labelFormatter:
                    (_: string, item2: string) => formatTime(item2, 'dd/MM/yyyy')
            }
        ]
        : []

    const formatLabel = (lines: TDataTooltip[]) => {
        const linesTooltips = lines.map(line => (
            line.seriesName + ': ' + line.value + '<br>'
        ))

        const tooltipTitle = xType === 'time'
            ? formatTime(
                dateFormat === 'yyyy-MM' ? lines[0].name + '-02' : lines[0].name,
                dateFormat === 'yyyy-MM' ? 'MMM/yy' : 'dd MMM'
            )
            : lines[0].name

        return `${tooltipTitle} <br> ${linesTooltips.join(' ')}`
    }

    const tooltip: TTooltipProps = {
        formatter: formatLabel,
        trigger: 'axis',
        textStyle: { fontSize: 11.5 }
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

    const title: TTitleProps = {
        id: 'chart-' + titleProps,
        left: '6.2%',
        show: titleProps !== undefined,
        text: titleProps,
        textAlign: 'left',
        textStyle: {
            fontFamily: 'Roboto',
            fontSize: 16,
            fontWeight: 400
        }
    }

    const options: TOptionsProps = {
        color: colors,
        series: series,
        xAxis: {
            type: 'category',
            data: xData,
            boundaryGap: false,
            showGrid: true,
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
                            dateFormat === 'yyyy-MM' ? item + '-02' : item,
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
            type: 'value',
            data: yData,
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
        grid: { ...gridProps || { bottom: 60 }, show: true },
        legend: {
            data: names
        },
        dataZoom: scrollable,
        title: title,
        toolbox,
        tooltip
    }

    return (
        <ReactCharts
            lazyUpdate
            notMerge
            style={ { width: '99.9%', height: 300 } }
            opts={ { width: width || 'auto' } }
            option={ options }
        />
    )
}

export default LineChart

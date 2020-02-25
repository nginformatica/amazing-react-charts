import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TAxisProps,
    TDataTooltip,
    TDataZoomChartProps,
    TDataZoomEventProps,
    TEntryData,
    TEntryDataTuples,
    TOptionsProps,
    TSaveAsImage,
    TSeries,
    TTitleProps,
    TTooltipProps,
    TZoomProps
} from './types'
import { formatToBRL } from 'brazilian-values'
import {
    formatTime,
    getDataView,
    getSaveAsImage,
    mountMessage,
    toDate,
    truncateLabel
} from './auxiliarFunctions'
import {
    dontShowLabel,
    fullText,
    normalLabel,
    rotatedLabel
} from './VerticalBarChart'

type TColorNTuples =
    | [string, string]
    | [string, string, string]
    | [string, string, string, string]

interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: TEntryDataTuples
    tooltipExtra?: string
    sumDataValues?: boolean
    colors?: TColorNTuples
    secondYAxisType?: 'percent' | string
}

const StackedBarChart = (props: IProps) => {
    const {
        tooltip: tooltipProps,
        data,
        colors,
        xType,
        yComplement,
        secondYAxisType,
        sumDataValues,
        dateFormat,
        grid: gridProps,
        width,
        barWidth,
        title: titleProps,
        toolboxTooltip,
        tooltipExtra
    } = props

    const {
        label,
        bottomResult,
        topResult,
        extraResult,
        lineResult,
        complement
    } = tooltipProps

    const [bottomData, topData, lineData = [], extraData] = data
    const yBottomData = bottomData.map((item: TEntryData) => item.result)
    const yTopData = topData.map((item: TEntryData) => item.result)
    const yExtraData = data.length === 4 && 
        extraData.map((item: TEntryData) => item.result)

    const yLineData = lineData.map((item: TEntryData) => item.result)
    const xData = xType === 'time'
        ? bottomData.map((item: TEntryData) => toDate(item.label, dateFormat))
        : bottomData.map((item: TEntryData) => item.label)

    const dynamicDataZoom = (
        item: TDataZoomEventProps,
        charts: TDataZoomChartProps
    ) => {
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

    const formatTooltip = (values: TDataTooltip[]) => {
        const valueBot = values[0] ? Number(values[0].data) : 0
        const valueTop = values[1] ? Number(values[1].data) : 0
        const stackedValues = valueBot + valueTop

        const tooltipBody =
            values.map((value: TDataTooltip) =>
                mountMessage(
                    value,
                    yComplement,
                    secondYAxisType,
                    stackedValues,
                    sumDataValues
                )
            ).join(' ')

        const labelResult = xType === 'time'
            ? label + ': ' + formatTime(values[0].name, 'MMM/yy') + '<br>'
            : label + ': ' + values[0].name + '<br>'

        const tooltipSumValues =
            sumDataValues && values.length === 3 && secondYAxisType
                ? complement + ': ' + formatToBRL(stackedValues)
                : sumDataValues && values.length === 2 && !secondYAxisType
                    ? complement + ': ' + formatToBRL(stackedValues)
                    : ''

        const tooltipFooter = tooltipExtra && !sumDataValues
            ? tooltipExtra
            : tooltipSumValues

        return [labelResult + tooltipBody + tooltipFooter]
    }

    const secondYAxis: TAxisProps = secondYAxisType === 'percent'
        ? {
            type: 'value',
            min: 0,
            max: 100,
            position: 'right',
            axisLine: {
                lineStyle: { color: colors[2] }
            },
            axisLabel: {
                formatter: '{value} %',
                color: colors[2]
            },
            splitLine: {
                show: false
            }
        }
        : {}

    const scrollable: TZoomProps[] = data[0].length > 12
        ? [
            {
                type: 'inside',
                endValue: xData.length > 12 ? xData[11] : xData[xData.length - 1]
            }, {
                show: true,
                type: 'slider',
                endValue: xData.length > 12 ? xData[11] : xData[xData.length - 1]
            }
        ]
        : []

    const title: TTitleProps = {
        id: 'chart-' + titleProps,
        left: '4%',
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
            right: '8.7%',
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

    const extraStackedSerie: TSeries = yExtraData && {
        barWidth: barWidth,
        yAxisIndex: 0,
        name: extraResult,
        type: 'bar',
        data: yExtraData,
        stack: 'stacked'
    }

    const options: TOptionsProps = {
        grid: gridProps,
        color: colors,
        series: [
            {
                barWidth: barWidth,
                yAxisIndex: 0,
                name: topResult,
                type: 'bar',
                data: yTopData,
                stack: 'stacked'
            },
            {
                barWidth: barWidth,
                yAxisIndex: 0,
                name: bottomResult,
                type: 'bar',
                data: yBottomData,
                stack: 'stacked'
            },
            extraStackedSerie,
            {
                yAxisIndex: secondYAxisType === 'percent' ? 1 : 0,
                name: lineResult,
                type: 'line',
                data: yLineData
            }
        ],
        xAxis: {
            data: xData,
            type: 'category',
            boundaryGap: true,
            axisLabel: {
                formatter: (item: string) => xType === 'time'
                    ? formatTime(item, 'MMM/yy')
                    : truncateLabel(item),
                textStyle: { fontSize: xData.length > 14 ? 10 : 11.5 },
                interval: xData.length > 20 ? 'auto' : 0
            },
            splitLine: {
                show: true,
                alignWithLabel: true
            },
            axisTick: {
                show: true,
                alignWithLabel: true
            }
        },
        yAxis: [{
            min: 0,
            type: 'value',
            position: 'left',
            axisLabel: {
                formatter: (item: string) => yComplement === 'money'
                    ? formatToBRL(item)
                    : item + (yComplement || ''),
                textStyle: { fontSize: 11.5 },
                interval: 0
            },
            data: yBottomData,
            splitLine: {
                show: true
            }
        },
        secondYAxis
        ],
        legend: {
            x: 'center',
            y: 'bottom',
            top: 30,
            data: [topResult, bottomResult, extraResult, lineResult],
            itemGap: 30
        },
        dataZoom: scrollable,
        title: title,
        toolbox
    }

    const tooltip: TTooltipProps = {
        formatter: formatTooltip,
        textStyle: { fontSize: 11.5 },
        trigger: 'axis'
    }

    return (
        <ReactEcharts
            notMerge
            style={ { width: '99%' } }
            opts={ { width: width } }
            onEvents={ { dataZoom: dynamicDataZoom } }
            option={
                tooltipProps
                    ? { ...options, tooltip }
                    : options
            }
        />
    )
}

export default StackedBarChart

import React, { useState, useEffect } from 'react'
import type { EChartsOption } from 'echarts-for-react'
import {
    LineChart as LineChartEcharts,
    ScatterChart as ScatterChartEcharts
} from 'echarts/charts'
import {
    GridComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import { zipWith } from 'ramda'
import type {
    IDefaultChartProps,
    TAudiometryDataEntry,
    AudiometryDataTooltip,
    LineStyleType,
    TSimpleLegend
} from '../types'
import {
    getDataView,
    getSaveAsImage,
    getSaveAsImageWithTitle
} from '../../lib/auxiliarFunctions'
import {
    fontFamily,
    TITLE_STYLE,
    LEGEND_STYLE,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { red } = theme.colors

echarts.use([
    GridComponent,
    TitleComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    LineChartEcharts,
    ScatterChartEcharts
])

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    height?: number
    colors?: string[]
    legendGap?: number
    symbolsSize?: number
    legendPadding?: number
    tooltipMarker?: boolean
    legendItemWidth?: number
    legendItemHeight?: number
    lineType?: LineStyleType
    legends?: TSimpleLegend[]
    data: TAudiometryDataEntry[][]
    legendType?: 'scroll' | 'plain'
    legendsPosition?: 'top' | 'bottom'
    formatTooltip?(items: AudiometryDataTooltip[]): string
}

const AudiometryChart = (props: IProps) => {
    const {
        data,
        grid,
        color,
        title,
        width,
        height,
        colors,
        legends,
        lineType,
        legendGap,
        legendType,
        symbolsSize,
        tooltipMarker,
        legendPadding,
        toolboxTooltip,
        legendsPosition,
        legendItemWidth,
        legendItemHeight,
        formatTooltip
    } = props

    const [showTitle, setShowTitle] = useState(false)

    const xData = ['.25', '.5', '1', '2', '3', '4', '6', '8']

    useEffect(() => {
        if (toolboxTooltip?.saveAsImageWithTitle) {
            setShowTitle(false)
        } else {
            setShowTitle(true)
        }
    }, [toolboxTooltip])

    const handleShowTitle = (show: boolean) => {
        setShowTitle(show)
    }

    const defaultTooltip = (items: AudiometryDataTooltip[]) => {
        if (legends) {
            const generateTooltip = items.map(item => {
                const marker = tooltipMarker ? item.marker : ''

                return `${marker} ${item.seriesName}: ${item.data.value} dB <br>`
            })

            return generateTooltip.join(' ')
        }
        // TODO: remove this default tooltip to turn it generic
        const item =
            items.length > 0 ? items[0].data : { value: 0, boneValue: 0 }

        const result =
            item.value || item.value === 0
                ? `Limiar Aéreo: ${item.value} dB <br>`
                : ''

        const boneResult =
            item.boneValue || item.boneValue === 0
                ? `Limiar Ósseo: ${item.boneValue} dB`
                : ''

        return result + boneResult
    }

    const takeYData = (item: TAudiometryDataEntry[]) =>
        item.map(item => ({
            name: item.result,
            value: item.result,
            symbol: item.symbol,
            symbolSize: symbolsSize || 12,
            boneValue: item.boneResult
        }))

    const takeMarks = (item: TAudiometryDataEntry[]) =>
        zipWith(
            (_, data) =>
                data.boneSymbol
                    ? {
                          value: data.boneResult,
                          symbol: data.boneSymbol,
                          symbolSize: symbolsSize || 12
                      }
                    : {},
            xData,
            item
        )

    const seriesMarks = data.map(item => ({
        data: takeMarks(item)
    }))

    const removedUndefinedMarks = seriesMarks.map(item =>
        item.data.filter(serie => serie.value !== undefined)
    )

    const marksWithTypes = removedUndefinedMarks
        .filter(item => item.length > 0)
        .map(item => ({
            name: 'marks',
            type: 'scatter',
            data: item
        }))

    const seriesData = data.map(item => ({
        type: 'line',
        data: takeYData(item),
        lineStyle: {
            width: 1,
            type: lineType || 'solid'
        }
    }))

    const series = [...marksWithTypes, ...seriesData].map((item, index) => ({
        ...item,
        name:
            legends && legends.length > 0
                ? legends[index].name
                : 'audiometry-' + index
    }))

    const legendProps =
        legendsPosition === 'bottom'
            ? {
                  top: 340,
                  data: legends,
                  type: legendType,
                  itemGap: legendGap || 5,
                  padding: legendPadding || 4,
                  itemWidth: legendItemWidth || 25,
                  itemHeight: legendItemHeight || 14,
                  textStyle: { ...LEGEND_STYLE }
              }
            : {
                  top: 30,
                  itemGap: 30,
                  data: legends,
                  textStyle: { ...LEGEND_STYLE }
              }

    const myTool = toolboxTooltip?.saveAsImageWithTitle && {
        myTool: getSaveAsImageWithTitle(
            toolboxTooltip.saveAsImageWithTitle.title ?? '',
            handleShowTitle
        )
    }

    const toolbox = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        feature: {
            ...myTool,
            saveAsImage:
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage.title ?? ''),
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title ?? '')
        }
    }

    const options: EChartsOption = () => ({
        color: colors,
        series: series,
        grid: { ...grid, show: false },
        title: {
            text: title,
            left: '6.2%',
            show: showTitle,
            textStyle: { ...TITLE_STYLE, color: color || red[600] }
        },
        xAxis: {
            type: 'category',
            data: xData,
            boundaryGap: true,
            splitLine: {
                show: true,
                alignWithLabel: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.2,
                    color: color || red[600]
                }
            },
            axisLine: {
                onZeroAxisIndex: 1,
                lineStyle: {
                    color: color || red[600]
                }
            },
            axisLabel: { fontFamily: fontFamily },
            axisTick: { show: true, alignWithLabel: true }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 130,
            interval: 10,
            inverse: true,
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.2,
                    color: color || red[600]
                }
            },
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                    color: color || red[600]
                }
            },
            axisTick: { show: true },
            axisLabel: { fontFamily: fontFamily }
        },
        legend: legends?.length ? legendProps : { show: false },
        tooltip: {
            trigger: 'axis',
            formatter: formatTooltip ?? defaultTooltip,
            ...TOOLTIP_DEFAULT_PROPS
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: (param: { title: string }) =>
                    `<div>${param.title}</div>`
            }
        }
    })

    return (
        <ReactEChartsCore
            notMerge
            lazyUpdate
            echarts={echarts}
            option={options()}
            opts={{ renderer: 'canvas', width: 'auto' }}
            style={{ width: width ?? '99.9%', height: height || 400 }}
        />
    )
}

export default AudiometryChart

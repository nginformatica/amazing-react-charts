import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import { zipWith } from 'ramda'
import type {
    IDefaultChartProps,
    TAudiometryDataEntry,
    AudiometryDataTooltip,
    LineStyleType,
    TSimpleLegend,
    EChartSeries
} from '../types'
import type { EChartsOption } from 'echarts/types/dist/echarts'
import {
    getDataView,
    getSaveAsImage,
    getSaveAsImageWithTitle,
    getWidthOpts
} from '../../lib/auxiliarFunctions'
import {
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { neutral, red } = theme.colors

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: TAudiometryDataEntry[][]
    height?: number
    lineType?: LineStyleType
    symbolsSize?: number
    colors?: string[]
    legendsPosition?: 'top' | 'bottom'
    legendGap?: number
    legendType?: 'scroll' | 'plain'
    legends?: TSimpleLegend[]
    legendPadding?: number
    legendItemWidth?: number
    legendItemHeight?: number
    tooltipMarker?: boolean
    formatTooltip?(items: AudiometryDataTooltip[]): string
}

const X_FIXED_DATA = ['.25', '.5', '1', '2', '3', '4', '6', '8']

const AudiometryChart = (props: IProps) => {
    const [title, setTitle] = useState(false)

    const {
        title: titleProps,
        symbolsSize,
        data,
        toolboxTooltip,
        lineType,
        color,
        grid,
        height,
        width,
        colors,
        legends,
        tooltipMarker,
        legendType,
        legendsPosition,
        legendGap,
        legendPadding,
        legendItemWidth,
        legendItemHeight,
        formatTooltip
    } = props

    const CHART_STYLE = { width: '99.9%', height: height || 400 }

    useEffect(() => {
        if (toolboxTooltip?.saveAsImageWithTitle) {
            setTitle(false)
        } else {
            setTitle(true)
        }
    }, [toolboxTooltip])

    const handleShowTitle = (show: boolean) => {
        setTitle(show)
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
            value: item.result,
            symbol: item.symbol,
            symbolSize: symbolsSize || 12,
            name: item.result,
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
            X_FIXED_DATA,
            item
        )

    const myTool = toolboxTooltip?.saveAsImageWithTitle && {
        myTool: getSaveAsImageWithTitle(
            toolboxTooltip.saveAsImageWithTitle.title ?? '',
            handleShowTitle
        )
    }

    const saveAsImage = toolboxTooltip?.saveAsImage && {
        saveAsImage: getSaveAsImage(toolboxTooltip.saveAsImage.title ?? '')
    }

    const toolbox: object | undefined = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        feature: {
            ...myTool,
            ...saveAsImage,
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title ?? '')
        }
    }

    const tooltip = {
        formatter: formatTooltip ?? defaultTooltip,
        trigger: 'axis' as const,
        backgroundColor: `${neutral[200]}99`,
        textStyle: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 11.5,
            color: neutral[50]
        },
        extraCssText: 'border: none; padding: 6px;'
    }

    // The mark color is always be the fist value on array
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

    const legendProps =
        legendsPosition === 'bottom'
            ? {
                  data: legends,
                  top: 340,
                  type: legendType,
                  itemGap: legendGap || 5,
                  padding: legendPadding || 4,
                  itemWidth: legendItemWidth || 25,
                  itemHeight: legendItemHeight || 14,
                  textStyle: {
                      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: 400,
                      color: neutral[200],
                      fontSize: 11.5
                  }
              }
            : {
                  top: 30,
                  data: legends,
                  itemGap: 30,
                  textStyle: {
                      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: 400,
                      color: neutral[200],
                      fontSize: 11.5
                  }
              }

    const dataWithNames: EChartSeries = [...marksWithTypes, ...seriesData].map(
        (item, index) => ({
            ...item,
            name:
                legends && legends.length > 0
                    ? legends[index].name
                    : 'audiometry-' + index
        })
    )

    const options: EChartsOption = {
        series: dataWithNames,
        xAxis: {
            type: 'category',
            data: X_FIXED_DATA,
            boundaryGap: true,
            axisLabel: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            splitLine: {
                // @ts-expect-error issue
                // https://github.com/apache/incubator-echarts/issues/13618
                alignWithLabel: true,
                show: true,
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
            axisTick: {
                show: true,
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 130,
            interval: 10,
            inverse: true,
            axisLabel: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.2,
                    color: color || red[600]
                }
            },
            axisTick: {
                // @ts-expect-error issue
                // https://github.com/apache/incubator-echarts/issues/13618
                alignWithLabel: true,
                show: true
            },
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                    color: color || red[600]
                }
            }
        },
        title: {
            left: '6.2%',
            show: title,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: color || red[600]
            }
        },
        color: colors,
        grid: {
            ...grid,
            show: false
        },
        legend: legends?.length ? legendProps : undefined,
        tooltip,
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: param => `<div>${param.title}</div>`
            }
        }
    }

    return (
        <ReactEcharts
            style={CHART_STYLE}
            opts={getWidthOpts(width || 'auto')}
            option={options}
        />
    )
}

export default AudiometryChart
